/* companion.js — talking to a headset's CompanionServer over Web Bluetooth.
 *
 * Every other network file here reads Meta's servers; adb.js reaches a headset
 * through the machine's adb. This file is the third kind: it speaks BLE straight
 * from the browser to the CompanionServer that runs on the Quest itself — the
 * same service the Meta phone app drives. The browser plays the phone's part.
 *
 * The protocol was reverse-engineered from com.oculus.companion.server and is
 * documented in data/companion.proto. Three layers stack up:
 *
 *   1. A GATT service (0xFEB8) with a command characteristic the central writes
 *      requests to and read-polls for responses, and a status characteristic
 *      the headset notifies on.
 *   2. A two-byte chunk header (end-bit + 15-bit sequence) that splits a blob
 *      across MTU-sized reads and writes.
 *   3. protobuf Request/Response envelopes. After a HELLO key exchange the whole
 *      channel is encrypted with libsodium crypto_box (X25519 + XSalsa20-
 *      Poly1305), so nothing but HELLO travels in the clear.
 *
 * A claimed headset answers a limited set of status methods to anyone, but
 * everything else needs AUTHENTICATE: an HMAC-SHA256 of the headset's challenge
 * keyed by the device's user secret, which the reader supplies.
 *
 * Credit: the protocol map and crypto come from ptrpaws/quest-ble-client.
 * MetaDB is not affiliated with Meta.
 */

import { deviceSecrets } from "./check.js?v=153";

/* ---------- constants ---------- */

const SERVICE_UUID = "0000feb8-0000-1000-8000-00805f9b34fb";
const CMD_CHAR_UUID = "7a442881-509c-47fa-ac02-b06a37d9eb76"; // write requests / read responses
const STATUS_CHAR_UUID = "7a442666-509c-47fa-ac02-b06a37d9eb76"; // headset state pushes

const HELLO_APP_ID = "625733718350566"; // what MQDH reports
const HELLO_APP_VERSION = "5.8.0";

/* Two protocol variants: the current build, and the older subset that shipped in
   CompanionServer versionCode 29 (Quest OS v50). The wire format is identical —
   v50 just supports fewer methods, so it gets a proto with the newer methods
   trimmed out, which is what narrows its command list. */
const PROTO_VERSION = "153";
const PROTO_FILES = {
  latest: "../data/companion.proto",
  v50: "../data/companion-v50.proto",
};
const protoUrl = (variant) => `${PROTO_FILES[variant] || PROTO_FILES.latest}?v=${PROTO_VERSION}`;

const SODIUM_URL = "https://cdn.jsdelivr.net/npm/libsodium-wrappers-sumo@0.7.15/+esm";
const PROTOBUF_URL = "https://cdn.jsdelivr.net/npm/protobufjs@7.5.4/+esm";

const REQUEST_TIMEOUT = 20000;

/* ---------- lazy dependency load ---------- */

let deps = null; // { sodium, protobuf, root, Request, Response, ... , methods, features }
let depsVariant = null;

async function load(variant = "latest") {
  if (deps && depsVariant === variant) return deps;

  const [sodiumMod, protobuf, protoText] = await Promise.all([
    import(SODIUM_URL),
    import(PROTOBUF_URL).then((m) => m.default ?? m),
    fetch(protoUrl(variant)).then((r) => {
      if (!r.ok) throw new Error(`could not load the protocol schema (${r.status})`);
      return r.text();
    }),
  ]);

  const sodium = sodiumMod.default ?? sodiumMod;
  await sodium.ready;

  const root = protobuf.parse(protoText, { keepCase: true }).root;
  root.resolveAll();

  const type = (name) => root.lookupType(`quest.${name}`);
  const methods = parseMethods(protoText, root);

  deps = {
    sodium,
    protobuf,
    root,
    type,
    Request: type("Request"),
    Response: type("Response"),
    HelloRequest: type("HelloRequest"),
    HelloResponse: type("HelloResponse"),
    HelloSignedData: type("HelloSignedData"),
    AuthenticateRequest: type("AuthenticateRequest"),
    ErrorDetails: type("ErrorDetails"),
    Method: root.lookupEnum("quest.Method"),
    ResponseCode: root.lookupEnum("quest.ResponseCode"),
    methods,
    features: buildFeatures(methods, type),
  };
  depsVariant = variant;
  return deps;
}

/* ---------- proto annotation parsing ----------
   protobufjs throws away the // @@ comments, so the Method enum's UI hints are
   read straight from the schema text, the same way the reference generator does. */

function camel(name) {
  return name
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join("");
}

function parseMethods(protoText, root) {
  const enumBlock = protoText.match(/enum Method \{([\s\S]*?)\n\}/)[1];
  const lines = enumBlock.split(/\r?\n/);
  const out = [];
  let ann = ""; // annotation lines accumulated above the current entry

  for (const line of lines) {
    const a = line.match(/\/\/\s*(@@.+?)\s*$/);
    if (a) {
      ann += a[1] + "\n";
      continue;
    }
    const e = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(\d+)\s*;/);
    if (!e) {
      if (line.trim() !== "") ann = ""; // a stray line breaks the run
      continue;
    }

    const name = e[1];
    const value = Number(e[2]);
    const block = ann;
    ann = "";
    const get = (key) => {
      const q = block.match(new RegExp(`@@${key}:\\s*"([^"]+)"`));
      if (q) return q[1];
      const b = block.match(new RegExp(`@@${key}:\\s*(\\S+)`));
      return b ? b[1] : null;
    };

    const reqAnn = get("request");
    const resAnn = get("response");
    const requestType =
      (reqAnn && safeLookup(root, reqAnn)) || safeLookup(root, camel(name) + "Request");
    const responseType =
      (resAnn && safeLookup(root, resAnn)) || safeLookup(root, camel(name) + "Response");

    out.push({
      name,
      value,
      title: get("title"),
      tab: get("tab"),
      group: get("group"),
      priority: get("priority") ? parseInt(get("priority"), 10) : undefined,
      primary: /@@primary\b/.test(block),
      ui: get("ui"),
      buttonLabel: get("buttonLabel"),
      confirm: get("confirm"),
      requestType: requestType ? requestType.name : null,
      responseType: responseType ? responseType.name : null,
    });
  }
  return out;
}

function safeLookup(root, name) {
  try {
    return root.lookup(`quest.${name}`);
  } catch {
    return null;
  }
}

/* ---------- feature model (tabs -> groups -> commands) ---------- */

function paramForField(field) {
  const t = field.type;
  const name = field.name;
  if (t === "string") {
    const secret = ["password", "pin"].some((s) => name.toLowerCase().includes(s));
    return { name, type: secret ? "password" : "text" };
  }
  if (t === "bool") return { name, type: "checkbox" };
  if (["int32", "uint32", "sint32", "int64", "uint64", "float", "double"].includes(t)) {
    return { name, type: "number" };
  }
  if (field.resolvedType && field.resolvedType.constructor.name === "Enum") {
    return { name, type: "enum", values: field.resolvedType.values };
  }
  // bytes or a nested message — needs a hand-written payload
  return { name, type: "raw", custom: true };
}

function labelFor(name) {
  const s = name.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildFeatures(methods, type) {
  const byTab = {};
  for (const cmd of methods) {
    if (!cmd.title || !cmd.tab || !cmd.group) continue;

    const base = {
      id: cmd.name,
      method: cmd.value,
      methodName: cmd.name,
      title: cmd.title,
      buttonLabel: cmd.buttonLabel,
      confirm: cmd.confirm,
      requestType: cmd.requestType,
      responseType: cmd.responseType,
      params: [],
      custom: false,
    };

    let commands = [];
    if (cmd.ui === "toggle" && cmd.requestType) {
      commands.push({ ...base, id: cmd.name + "_ENABLE", title: "Enable", fixed: { enable: true } });
      commands.push({ ...base, id: cmd.name + "_DISABLE", title: "Disable", fixed: { enable: false } });
    } else {
      const reqType = cmd.requestType ? type(cmd.requestType) : null;
      if (reqType) {
        for (const f of reqType.fieldsArray) {
          const p = paramForField(f);
          p.label = labelFor(f.name);
          if (p.custom) base.custom = true;
          base.params.push(p);
        }
      }
      commands.push(base);
    }

    byTab[cmd.tab] = byTab[cmd.tab] || { tab: cmd.tab, groups: {} };
    for (const c of commands) {
      const g = (byTab[cmd.tab].groups[cmd.group] = byTab[cmd.tab].groups[cmd.group] || {
        title: cmd.group,
        priority: cmd.priority,
        primary: null,
        secondary: [],
      });
      if (cmd.priority !== undefined && g.priority === undefined) g.priority = cmd.priority;
      if (cmd.primary && cmd.ui !== "toggle") g.primary = c;
      else g.secondary.push(c);
    }
  }

  const tabs = Object.values(byTab).map((t) => ({
    tab: t.tab,
    groups: Object.values(t.groups).sort((a, b) => {
      const pa = a.priority ?? 999,
        pb = b.priority ?? 999;
      return pa !== pb ? pa - pb : a.title.localeCompare(b.title);
    }),
  }));
  const order = ["CONTROL", "NETWORK", "SYSTEM", "SECURITY", "DEVELOPER"];
  tabs.sort((a, b) => order.indexOf(a.tab) - order.indexOf(b.tab));
  return tabs;
}

/* ---------- custom payloads ----------
   A handful of commands take a nested message or a value the form can't spell.
   These build the request object by hand; `client` gives access to the secret. */

function customPayloads(client) {
  return {
    WIFI_FORGET: {
      params: [{ name: "ssid", type: "text", label: "SSID to forget" }],
      build: (f) => (f.ssid ? { network: { ssid: f.ssid } } : null),
    },
    CONTROLLER_UNPAIR: {
      params: [{ name: "id", type: "text", label: "Address or ID to unpair" }],
      build: (f) => {
        if (!f.id) return null;
        const type = f.id.includes(":") ? 2 /* THIRD_PARTY */ : 0 /* PRIMARY */;
        return { controller: { id: f.id, type } };
      },
    },
    TIME_SET: {
      title: "Sync time to now",
      params: [],
      build: () => ({
        time_ms: String(Date.now()),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    },
    OCULUS_SET_USER_SECRET: {
      params: [],
      build: () => {
        const s = client.secretBytes();
        if (!s) {
          alert("Set a 64-character device secret above first.");
          return null;
        }
        return { user_secret_key: s };
      },
    },
    MIRROR_REQUEST: {
      title: "Start mirroring",
      buttonLabel: "Start",
      params: [
        { name: "session_id", type: "text", label: "Session ID (optional)" },
        { name: "show_dialog", type: "checkbox", label: "Show in-headset dialog", default: true },
      ],
      build: (f) => ({
        start: true,
        show_dialog: f.show_dialog,
        session_id: f.session_id || undefined,
        supported_signaling_transports: [1 /* CLIENT_SYNC */],
      }),
    },
  };
}

const extraCommands = {
  CONTROL: [
    {
      group: "SCREEN MIRRORING",
      command: {
        id: "MIRROR_STOP",
        methodName: "MIRROR_REQUEST",
        title: "Stop mirroring",
        params: [],
        fixed: { start: false },
      },
    },
  ],
};

/* ---------- crypto box (libsodium crypto_box_easy) ---------- */

class CryptoBox {
  constructor(sodium, theirPub, myPriv) {
    this.s = sodium;
    this.theirPub = theirPub;
    this.myPriv = myPriv;
  }
  encrypt(plain) {
    const nonce = this.s.randombytes_buf(this.s.crypto_box_NONCEBYTES);
    const ct = this.s.crypto_box_easy(plain, nonce, this.theirPub, this.myPriv);
    const out = new Uint8Array(nonce.length + ct.length);
    out.set(nonce);
    out.set(ct, nonce.length);
    return out;
  }
  decrypt(msg) {
    const n = this.s.crypto_box_NONCEBYTES;
    if (msg.length < n) throw new Error("ciphertext too short");
    const nonce = msg.slice(0, n);
    const ct = msg.slice(n);
    const out = this.s.crypto_box_open_easy(ct, nonce, this.theirPub, this.myPriv);
    if (!out) throw new Error("decryption failed");
    return out;
  }
}

/* ---------- chunk framing ---------- */

function chunk(data, maxPayload) {
  const size = Math.max(1, maxPayload);
  const chunks = [];
  const n = Math.max(1, Math.ceil(data.length / size));
  for (let i = 0; i < n; i++) {
    const payload = data.slice(i * size, i * size + size);
    let header = i;
    if (i === n - 1) header |= 0x8000;
    const out = new Uint8Array(2 + payload.length);
    out[0] = (header >> 8) & 0xff;
    out[1] = header & 0xff;
    out.set(payload, 2);
    chunks.push(out);
  }
  return chunks;
}

/* ---------- the client ---------- */

const State = {
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  PAIRING: "pairing",
  AUTHENTICATING: "authenticating",
  READY: "ready",
};

class CompanionClient {
  constructor() {
    this.state = State.DISCONNECTED;
    this.device = null;
    this.server = null;
    this.cmdChar = null;
    this.statusChar = null;
    this.mtu = 23;
    this.maxPayload = 18;
    this.seq = 0;
    this.chain = Promise.resolve();
    this.session = null; // { keyPair, clientChallenge, box, authChallenge }
    this._secret = null; // Uint8Array(32)
    this.onState = null;
    this.onLog = null;
    this.authRequired = false;
    this.variant = "latest"; // which protocol variant to load (latest | v50)
  }

  secretBytes() {
    return this._secret;
  }
  setSecret(hex) {
    if (/^[0-9a-fA-F]{64}$/.test(hex || "")) {
      this._secret = hexToBytes(hex);
      return true;
    }
    this._secret = null;
    return false;
  }

  #setState(s, info) {
    this.state = s;
    this.onState?.(s, info);
  }
  #log(entry) {
    this.onLog?.({ time: new Date().toLocaleTimeString([], { hour12: false }), ...entry });
  }

  async connect() {
    if (this.state !== State.DISCONNECTED) return;
    if (!navigator.bluetooth) throw new Error("this browser has no Web Bluetooth — use Chrome or Edge on desktop or Android");

    await load(this.variant);
    this.#setState(State.CONNECTING);
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
      });
    } catch (e) {
      this.#setState(State.DISCONNECTED, "cancelled");
      throw e;
    }

    this.device.addEventListener("gattserverdisconnected", () => this.#onDrop("the headset disconnected"));
    try {
      this.server = await this.device.gatt.connect();
      const service = await this.server.getPrimaryService(SERVICE_UUID);
      this.cmdChar = await service.getCharacteristic(CMD_CHAR_UUID);
      try {
        this.statusChar = await service.getCharacteristic(STATUS_CHAR_UUID);
      } catch {
        this.statusChar = null;
      }
      this.mtu = this.server.mtu || 23;
      this.maxPayload = Math.max(1, this.mtu - 5);

      await this.#pair();
    } catch (e) {
      this.disconnect();
      throw e;
    }
  }

  disconnect() {
    try {
      if (this.server && this.server.connected) this.server.disconnect();
    } catch {}
    this.#onDrop("disconnected");
  }

  #onDrop(reason) {
    this.session = null;
    this.seq = 0;
    this.device = null;
    this.server = null;
    this.cmdChar = null;
    this.statusChar = null;
    this.authRequired = false;
    if (this.state !== State.DISCONNECTED) this.#setState(State.DISCONNECTED, reason);
  }

  get deviceName() {
    return this.device?.name || null;
  }

  async #pair() {
    this.#setState(State.PAIRING);
    const { sodium, HelloRequest, HelloResponse, HelloSignedData } = deps;

    const keyPair = sodium.crypto_box_keypair();
    const clientChallenge = sodium.randombytes_buf(16);
    this.session = { keyPair, clientChallenge, box: null, authChallenge: null };

    const body = HelloRequest.encode(
      HelloRequest.fromObject({
        client_public_key: keyPair.publicKey,
        client_challenge: clientChallenge,
        app_id: HELLO_APP_ID,
        app_version: HELLO_APP_VERSION,
      })
    ).finish();

    const res = await this.#send(deps.Method.values.HELLO, "HELLO", body);
    if (res.code !== 0) throw new Error("the headset refused the HELLO handshake");

    const hello = HelloResponse.decode(res.body);
    const signed = HelloSignedData.decode(bytesOf(hello.signed_data));
    const serverPub = bytesOf(signed.server_public_key);
    if (!serverPub || !serverPub.length) throw new Error("HELLO response had no server key");

    this.session.box = new CryptoBox(sodium, serverPub, keyPair.privateKey);
    const authChallenge = bytesOf(signed.authentication_challenge);
    this.authRequired = !!(authChallenge && authChallenge.length);
    this.session.authChallenge = this.authRequired ? authChallenge : null;

    if (!this.authRequired) {
      this.#setState(State.READY, "unclaimed device — limited methods");
      return;
    }

    if (!this._secret) {
      // Secure channel is up, but claimed methods need the secret. Stay usable
      // for the status methods the headset allows without auth.
      this.#setState(State.READY, "connected without a secret — status only");
      return;
    }

    await this.authenticate();
  }

  async authenticate() {
    if (!this.session?.box) throw new Error("not connected");
    if (!this.session.authChallenge) return; // nothing to prove
    if (!this._secret) throw new Error("set a 64-character device secret first");
    this.#setState(State.AUTHENTICATING);
    const { sodium, AuthenticateRequest } = deps;
    const signed = sodium.crypto_auth_hmacsha256(this.session.authChallenge, this._secret);
    const body = AuthenticateRequest.encode(
      AuthenticateRequest.fromObject({ signed_authentication_challenge: signed })
    ).finish();
    const res = await this.#send(deps.Method.values.AUTHENTICATE, "AUTHENTICATE", body);
    if (res.code !== 0) {
      this.#setState(State.READY, "authentication failed — check the secret");
      throw new Error("authentication failed — the device secret was rejected");
    }
    this.#setState(State.READY, "authenticated");
  }

  /** Run a method by name with a plain payload object. Serialized behind others. */
  execute(methodName, payloadObj) {
    const run = this.chain.then(() => this.#execute(methodName, payloadObj));
    this.chain = run.then(
      () => {},
      () => {}
    );
    return run;
  }

  async #execute(methodName, payloadObj) {
    if (this.state !== State.READY) throw new Error("not connected");
    const method = deps.Method.values[methodName];
    if (method === undefined) throw new Error(`unknown method ${methodName}`);

    let body = null;
    const reqName = deps.methods.find((m) => m.name === methodName)?.requestType;
    if (payloadObj && reqName) {
      const T = deps.type(reqName);
      body = T.encode(T.fromObject(payloadObj)).finish();
    }
    const res = await this.#send(method, methodName, body);
    return this.#decodeResponse(methodName, res);
  }

  #decodeResponse(methodName, res) {
    const out = { code: res.code, codeName: nameOf(deps.ResponseCode, res.code), body: res.body, decoded: null, error: null };
    if (res.code === 0) {
      const resName = deps.methods.find((m) => m.name === methodName)?.responseType;
      if (res.body && res.body.length && resName) {
        try {
          const T = deps.type(resName);
          out.decoded = T.toObject(T.decode(res.body), {
            enums: String,
            longs: String,
            bytes: (b) => bytesToHex(b),
            defaults: false,
            arrays: true,
            objects: true,
          });
        } catch (e) {
          out.decoded = { raw: bytesToHex(res.body) };
        }
      }
    } else if (res.body && res.body.length) {
      try {
        const err = deps.ErrorDetails.toObject(deps.ErrorDetails.decode(res.body), {
          enums: String,
          longs: String,
          defaults: false,
        });
        out.error = err;
      } catch {}
    }
    return out;
  }

  /** Encode a Request, encrypt when the channel is secure, chunk, write, poll. */
  async #send(method, methodName, body) {
    const seq = this.seq++;
    const encoded = deps.Request.encode(
      deps.Request.fromObject({ version: 1, method, seq, body: body || undefined })
    ).finish();

    let toSend = encoded;
    let encrypted = false;
    if (this.session?.box && method !== deps.Method.values.HELLO) {
      toSend = this.session.box.encrypt(encoded);
      encrypted = true;
    }
    this.#log({ dir: "sent", method: methodName, seq, encrypted, size: toSend.length });

    for (const c of chunk(toSend, this.maxPayload)) {
      await this.cmdChar.writeValueWithResponse(c);
    }

    const raw = await this.#poll(REQUEST_TIMEOUT);
    let plain = raw;
    if (encrypted) plain = this.session.box.decrypt(raw);

    const resp = deps.Response.decode(plain);
    if (resp.seq !== seq) {
      // A stale response — ignore and treat as an error rather than mixing wires.
      throw new Error(`out-of-order reply (wanted ${seq}, got ${resp.seq})`);
    }
    const code = typeof resp.code === "number" ? resp.code : 0;
    this.#log({ dir: "recv", method: methodName, seq, encrypted, code, codeName: nameOf(deps.ResponseCode, code) });
    return { code, body: resp.body && resp.body.length ? bytesOf(resp.body) : null };
  }

  /** Read the command characteristic until a full framed message arrives. */
  async #poll(timeout) {
    const deadline = Date.now() + timeout;
    let buf = new Uint8Array(0);
    let expected = 0;
    while (Date.now() < deadline) {
      let view;
      try {
        view = await this.cmdChar.readValue();
      } catch (e) {
        throw new Error("the headset stopped answering");
      }
      const value = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
      if (value.length < 2) {
        // 0xFF terminator or an empty read — nothing queued yet.
        await sleep(25);
        continue;
      }
      const header = (value[0] << 8) | value[1];
      const last = (header & 0x8000) !== 0;
      const pktSeq = header & 0x7fff;
      const payload = value.slice(2);

      if (pktSeq !== expected) {
        // A fresh blob started mid-read; restart reassembly.
        buf = new Uint8Array(0);
        expected = 0;
        if (pktSeq !== 0) {
          await sleep(15);
          continue;
        }
      }
      const next = new Uint8Array(buf.length + payload.length);
      next.set(buf);
      next.set(payload, buf.length);
      buf = next;
      expected++;
      if (last) return buf;
    }
    throw new Error("timed out waiting for the headset to reply");
  }
}

/* ---------- helpers ---------- */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}
function bytesToHex(b) {
  if (!b) return "";
  const a = b instanceof Uint8Array ? b : new Uint8Array(b);
  return Array.from(a, (x) => x.toString(16).padStart(2, "0")).join("");
}
function bytesOf(v) {
  if (!v) return v;
  if (v instanceof Uint8Array) return v;
  if (typeof v === "string") return hexToBytes(v); // shouldn't happen, we decode with Uint8Array
  return new Uint8Array(v);
}
function nameOf(enumType, value) {
  for (const [k, v] of Object.entries(enumType.values)) if (v === value) return k;
  return String(value);
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* Turn a value from the account query into a 64-hex device secret, or null.
   Meta may hand it back as hex or base64; either way it is 32 bytes. */
function normalizeSecret(v) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (/^[0-9a-fA-F]{64}$/.test(s)) return s.toLowerCase();
  if (/^[A-Za-z0-9+/=_-]{43,48}$/.test(s)) {
    try {
      const b = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
      if (b.length === 32) return Array.from(b, (c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
    } catch {}
  }
  return null;
}

/* Walk the query result for anything that looks like a device secret, keeping a
   nearby human label (headset name / serial / id) with each. The exact shape of
   this response isn't pinned, so this stays permissive rather than hard-coding a
   path — a field whose name mentions "secret" wins, "key" is the fallback. */
function extractSecrets(data) {
  const strong = [];
  const weak = [];
  const walk = (node, label) => {
    if (node == null || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach((n) => walk(n, label));
    const here =
      node.name || node.device_name || node.serial || node.serial_number || node.hmd_serial || node.id || label;
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "string") {
        const hex = normalizeSecret(v);
        if (!hex) continue;
        if (/secret/i.test(k)) strong.push({ label: here, hex });
        else if (/key/i.test(k)) weak.push({ label: here, hex });
      } else walk(v, here);
    }
  };
  walk(data, null);
  const chosen = strong.length ? strong : weak;
  const seen = new Set();
  return chosen.filter((c) => (seen.has(c.hex) ? false : seen.add(c.hex)));
}

/* ---------- UI ---------- */

let mounted = false;

export async function initCompanion(section) {
  if (mounted) return;
  mounted = true;

  if (!navigator.bluetooth) {
    const note = section.querySelector("#companionUnsupported");
    if (note) note.hidden = false;
  }

  const client = new CompanionClient();

  const el = {
    version: section.querySelector("#companionVersion"),
    secret: section.querySelector("#companionSecret"),
    fetchSecret: section.querySelector("#companionFetchSecret"),
    secretPick: section.querySelector("#companionSecretPick"),
    connect: section.querySelector("#companionConnect"),
    disconnect: section.querySelector("#companionDisconnect"),
    auth: section.querySelector("#companionAuth"),
    state: section.querySelector("#companionState"),
    tabs: section.querySelector("#companionTabs"),
    panels: section.querySelector("#companionPanels"),
  };

  // Rebuild the command panels next connect if the protocol variant changed.
  el.version.addEventListener("change", () => {
    delete el.panels.dataset.built;
  });

  el.connect.addEventListener("click", async () => {
    if (el.secret.value.trim() && !client.setSecret(el.secret.value.trim())) {
      setState("A device secret must be 64 hex characters (32 bytes). Leave it blank for status-only.", "warn");
      return;
    }
    client.variant = el.version.value || "latest";
    el.connect.disabled = true;
    el.connect.textContent = "Connecting…";
    try {
      await client.connect();
    } catch (e) {
      setState(e.message || "connection failed", "warn");
    } finally {
      el.connect.disabled = false;
      el.connect.textContent = "Connect";
    }
  });

  el.disconnect.addEventListener("click", () => client.disconnect());

  /* Pull the device secret straight from the signed-in account rather than
     making the reader find it by hand. */
  el.fetchSecret.addEventListener("click", async () => {
    el.fetchSecret.disabled = true;
    const was = el.fetchSecret.textContent;
    el.fetchSecret.textContent = "Fetching…";
    try {
      const found = extractSecrets(await deviceSecrets());
      if (!found.length) {
        setState("No device secret on this account — set your own access token in Settings.", "warn");
        el.secretPick.hidden = true;
        return;
      }
      if (found.length === 1) {
        el.secret.value = found[0].hex;
        el.secretPick.hidden = true;
        setState(`Filled the secret for ${esc(found[0].label || "your headset")}.`, "ok");
      } else {
        el.secretPick.innerHTML = '<option value="">Pick a headset…</option>';
        for (const f of found) {
          const o = document.createElement("option");
          o.value = f.hex;
          o.textContent = f.label || f.hex.slice(0, 8) + "…";
          el.secretPick.appendChild(o);
        }
        el.secretPick.hidden = false;
        setState(`Found ${found.length} headsets — pick one to fill its secret.`, "ok");
      }
    } catch (e) {
      setState(e.message || "could not fetch the device secret", "warn");
    } finally {
      el.fetchSecret.disabled = false;
      el.fetchSecret.textContent = was;
    }
  });

  el.secretPick.addEventListener("change", () => {
    if (el.secretPick.value) {
      el.secret.value = el.secretPick.value;
      setState("Secret filled.", "ok");
    }
  });

  el.auth.addEventListener("click", async () => {
    if (!client.setSecret(el.secret.value.trim())) {
      setState("Enter a 64-hex-character device secret to authenticate.", "warn");
      return;
    }
    el.auth.disabled = true;
    try {
      await client.authenticate();
    } catch (e) {
      setState(e.message, "warn");
    } finally {
      el.auth.disabled = false;
    }
  });

  client.onState = (s, info) => {
    const ready = s === State.READY;
    const connected = s !== State.DISCONNECTED;
    el.version.disabled = connected;
    el.connect.hidden = connected;
    el.disconnect.hidden = !connected;
    el.tabs.hidden = !ready;
    el.panels.hidden = !ready;
    // Offer explicit auth only when the channel is up, the device wants it,
    // and we're not already authenticated.
    el.auth.hidden = !(ready && client.authRequired && info && /status only|failed/.test(info));

    const name = client.deviceName ? ` · ${esc(client.deviceName)}` : "";
    const label =
      s === State.CONNECTING
        ? "Connecting…"
        : s === State.PAIRING
        ? "Exchanging keys…"
        : s === State.AUTHENTICATING
        ? "Authenticating…"
        : ready
        ? `Connected${name}${info ? " — " + esc(info) : ""}`
        : `Not connected${info ? " — " + esc(info) : ""}`;
    setState(label, ready ? "ok" : connected ? "" : "");
    if (ready && !el.panels.dataset.built) buildPanels();
  };

  function setState(text, kind) {
    el.state.textContent = text;
    el.state.dataset.kind = kind || "";
  }

  /* Build the tabbed command panels once the deps are loaded. */
  function buildPanels() {
    el.panels.dataset.built = "1";
    el.tabs.innerHTML = "";
    el.panels.innerHTML = "";

    const patches = customPayloads(client);
    const features = withExtras(deps.features);

    features.forEach((feature, i) => {
      const tabBtn = document.createElement("button");
      tabBtn.type = "button";
      tabBtn.className = "companion-tab";
      tabBtn.textContent = titleCase(feature.tab);
      tabBtn.addEventListener("click", () => selectTab(i));
      el.tabs.appendChild(tabBtn);

      const panel = document.createElement("div");
      panel.className = "companion-panel";
      panel.hidden = i !== 0;
      for (const group of feature.groups) panel.appendChild(renderGroup(group, patches));
      el.panels.appendChild(panel);
    });

    function selectTab(idx) {
      [...el.tabs.children].forEach((b, j) => b.classList.toggle("on", j === idx));
      const panels = [...el.panels.children];
      panels.forEach((p, j) => (p.hidden = j !== idx));
      // Reuse the site's view-in reveal (it's gated by prefers-reduced-motion in CSS).
      const shown = panels[idx];
      if (shown) {
        shown.classList.remove("view-in");
        void shown.offsetWidth; // reflow so the animation restarts
        shown.classList.add("view-in");
        shown.addEventListener("animationend", () => shown.classList.remove("view-in"), { once: true });
      }
    }
    selectTab(0);
  }

  function renderGroup(group, patches) {
    const wrap = document.createElement("section");
    wrap.className = "companion-group";
    const h = document.createElement("h3");
    h.textContent = group.title;
    wrap.appendChild(h);
    if (group.primary) wrap.appendChild(renderCommand(group.primary, patches, true));
    for (const c of group.secondary) wrap.appendChild(renderCommand(c, patches, false));
    return wrap;
  }

  function renderCommand(cmd, patches, primary) {
    const patch = patches[cmd.methodName];
    const params = patch && patch.params ? patch.params : cmd.params;
    const title = (patch && patch.title) || cmd.title;
    const btnLabel = (patch && patch.buttonLabel) || cmd.buttonLabel || "Run";

    const row = document.createElement("div");
    row.className = "companion-cmd" + (primary ? " is-primary" : "");

    const form = document.createElement("form");
    form.className = "companion-cmd-form";

    const label = document.createElement("span");
    label.className = "companion-cmd-title";
    label.textContent = title;
    form.appendChild(label);

    const inputs = {};
    for (const p of params) {
      const field = renderField(cmd, p, inputs);
      if (field) form.appendChild(field);
    }

    const btn = document.createElement("button");
    btn.type = "submit";
    btn.textContent = btnLabel;
    form.appendChild(btn);

    const out = document.createElement("pre");
    out.className = "companion-result";
    out.hidden = true;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (cmd.confirm && !confirm(cmd.confirm)) return;

      let payload;
      if (cmd.fixed) payload = cmd.fixed;
      else if (patch && patch.build) {
        payload = patch.build(readForm(params, inputs));
        if (payload === null) return; // cancelled / invalid
      } else if (cmd.custom) {
        try {
          payload = readForm(params, inputs, true);
        } catch (err) {
          showResult(out, { code: -1, error: { message: err.message } }, true);
          return;
        }
      } else {
        payload = params.length ? readForm(params, inputs) : null;
      }

      btn.disabled = true;
      const was = btn.textContent;
      btn.textContent = "…";
      try {
        const res = await client.execute(cmd.methodName, payload);
        showResult(out, res, false);
      } catch (err) {
        showResult(out, { code: -1, error: { message: err.message } }, true);
      } finally {
        btn.disabled = false;
        btn.textContent = was;
      }
    });

    row.appendChild(form);
    row.appendChild(out);
    return row;
  }

  function renderField(cmd, p, inputs) {
    const wrap = document.createElement("label");
    wrap.className = "companion-field";
    const cap = document.createElement("span");
    cap.textContent = p.label || labelFor(p.name);

    let input;
    if (p.type === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
      if (p.default) input.checked = true;
      wrap.classList.add("is-check");
    } else if (p.type === "enum") {
      input = document.createElement("select");
      for (const [name, val] of Object.entries(p.values)) {
        const o = document.createElement("option");
        o.value = String(val);
        o.textContent = name;
        input.appendChild(o);
      }
    } else {
      input = document.createElement("input");
      input.type = p.type === "password" ? "password" : p.type === "number" ? "number" : "text";
      if (p.type === "raw") input.placeholder = "hex or JSON";
      input.autocomplete = "off";
      input.spellcheck = false;
    }
    inputs[p.name] = { input, type: p.type };
    if (p.type === "checkbox") {
      wrap.appendChild(input);
      wrap.appendChild(cap);
    } else {
      wrap.appendChild(cap);
      wrap.appendChild(input);
    }
    return wrap;
  }

  function readForm(params, inputs, allowRaw) {
    const obj = {};
    for (const p of params) {
      const { input, type } = inputs[p.name];
      if (type === "checkbox") obj[p.name] = input.checked;
      else if (type === "number") {
        if (input.value !== "") obj[p.name] = Number(input.value);
      } else if (type === "enum") obj[p.name] = Number(input.value);
      else if (type === "raw") {
        const v = input.value.trim();
        if (!v) continue;
        if (allowRaw) {
          if (/^[0-9a-fA-F]+$/.test(v) && v.length % 2 === 0) obj[p.name] = hexToBytes(v);
          else obj[p.name] = JSON.parse(v);
        }
      } else if (input.value !== "") obj[p.name] = input.value;
    }
    return obj;
  }

  function showResult(out, res, isError) {
    out.hidden = false;
    out.dataset.kind = isError || (res.code !== 0 && res.code !== undefined) ? "err" : "ok";
    if (isError) {
      out.textContent = "Error: " + (res.error?.message || "failed");
      return;
    }
    if (res.code === 0) {
      if (res.decoded && Object.keys(res.decoded).length) out.textContent = JSON.stringify(res.decoded, null, 2);
      else out.textContent = "OK";
    } else {
      let msg = "Failed: " + (res.codeName || res.code);
      if (res.error) msg += "\n" + JSON.stringify(res.error, null, 2);
      out.textContent = msg;
    }
  }

  function withExtras(features) {
    const clone = features.map((f) => ({ tab: f.tab, groups: f.groups.map((g) => ({ ...g, secondary: [...g.secondary] })) }));
    for (const [tab, adds] of Object.entries(extraCommands)) {
      const feature = clone.find((f) => f.tab === tab);
      if (!feature) continue;
      for (const add of adds) {
        let g = feature.groups.find((x) => x.title === add.group);
        if (!g) {
          g = { title: add.group, priority: 999, primary: null, secondary: [] };
          feature.groups.push(g);
        }
        g.secondary.push(add.command);
      }
    }
    return clone;
  }
}

function titleCase(s) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}
