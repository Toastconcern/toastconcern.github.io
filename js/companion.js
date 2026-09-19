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

import { deviceSecrets, loadSecrets, saveSecrets, clearSecrets } from "./check.js?v=157";

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
const PROTO_VERSION = "157";
const PROTO_FILES = {
  latest: "../data/companion.proto",
  v50: "../data/companion-v50.proto",
};
const protoUrl = (variant) => `${PROTO_FILES[variant] || PROTO_FILES.latest}?v=${PROTO_VERSION}`;

const SODIUM_URL = "https://cdn.jsdelivr.net/npm/libsodium-wrappers-sumo@0.7.15/+esm";
const PROTOBUF_URL = "https://cdn.jsdelivr.net/npm/protobufjs@7.5.4/+esm";

const REQUEST_TIMEOUT = 20000;

/* A few methods block on the headset for far longer than a reply normally takes,
   and 20 seconds gives up on work that is still going. The numbers come from the
   server itself: WifiModule.enableWifi() spins for up to 45s waiting for the radio,
   setNewWifiConf() then waits up to another 45s for the supplicant, and
   CompanionService.provisionWifi() spends 10s more proving it can reach
   graph.oculus.com before it answers at all. */
const METHOD_TIMEOUT = {
  WIFI_CONNECT: 120000,
  WIFI_RECONNECT: 70000,
  WIFI_SCAN: 70000,
  WIFI_ENABLE: 60000,
};

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
  /* protobufjs arrives minified from the CDN, so an Enum's constructor.name is
     whatever the minifier renamed the class to — never "Enum". Tell the two
     apart by shape instead: an Enum carries values and no fields. Getting this
     wrong dropped every enum field into the raw hex/JSON box below, which is
     why picking a Wi-Fi security type meant typing WPA into it by hand. */
  const rt = field.resolvedType;
  if (rt && rt.values && !rt.fields) return { name, type: "enum", values: rt.values };
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
    /* The typed-in half of joining a network. The generated form put the
       security enum on screen as a bare list of protocol names defaulting to
       NONE, which is the one value that quietly breaks the request — see the
       Wi-Fi section below for what the headset does with it. */
    WIFI_CONNECT: {
      title: "Type in a network",
      buttonLabel: "Connect",
      params: [
        { name: "ssid", type: "text", label: "Network name" },
        {
          name: "auth",
          type: "choice",
          label: "Security",
          default: "WPA",
          values: [
            ["WPA", "WPA / WPA2"],
            ["NONE", "Open — no password"],
            ["WEP", "WEP"],
            ["EAP", "Enterprise (PEAP)"],
          ],
        },
        { name: "username", type: "text", label: "Username" },
        { name: "password", type: "password", label: "Password" },
        { name: "hidden", type: "checkbox", label: "Hidden network" },
      ],
      onForm: (inputs) => {
        const sync = () => {
          const auth = inputs.auth.input.value;
          showField(inputs.password, auth !== "NONE");
          showField(inputs.username, auth === "EAP");
        };
        inputs.auth.input.addEventListener("change", sync);
        sync();
      },
      build: (f) => {
        const ssid = (f.ssid || "").trim();
        if (!ssid) throw new Error("Enter the network name.");
        const auth = f.auth || "WPA";
        const problem = passwordProblem(auth, f.password);
        if (problem) throw new Error(problem);
        const req = { ssid, auth: WIFI_AUTH[auth], hidden: !!f.hidden };
        if (auth !== "NONE") req.password = f.password;
        if (auth === "EAP") req.username = (f.username || "").trim();
        return req;
      },
    },
    WIFI_FORGET: {
      params: [{ name: "ssid", type: "text", label: "SSID to forget", suggest: "known" }],
      build: (f) => (f.ssid ? { network: { ssid: f.ssid } } : null),
    },
    /* Rejoining something the headset already holds the password for. Nothing
       to type but the name, and the names it knows come from the last status. */
    WIFI_RECONNECT: {
      params: [{ name: "ssid", type: "text", label: "SSID", suggest: "known" }],
      build: (f) => (f.ssid ? { ssid: f.ssid } : null),
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

/* ---------- Wi-Fi ----------
   Joining a network by hand is the part of this panel that fails, and it fails
   misleadingly. CompanionServer takes the security field at its word:
   WifiModule.setNewWifiConf builds the headset's WifiConfiguration straight from
   it, so an open-security guess against a WPA access point is configured as an
   open network, the access point refuses the association, and what comes back up
   the wire is WIFI_NO_NETWORK — "no network" for a network standing right there.
   The picker below asks the headset what it can see and fills the name and the
   security type in from that answer, leaving only the password to type. */

const WIFI_AUTH = { NONE: 1, EAP: 2, WPA: 3, WEP: 4 };

const AUTH_LABEL = { NONE: "open", WEP: "WEP", WPA: "WPA", EAP: "enterprise" };

const AUTH_RULE = {
  WPA: "A WPA password is 8 to 63 characters.",
  WEP: "A WEP key is 5 or 13 characters, or 10 or 26 hex digits.",
  EAP: "PEAP — the username and password the network issued you.",
  NONE: "",
};

/* A scan result lists every security an access point advertises, and the server
   fills that list by substring match on the capabilities string — so a
   WPA-Enterprise AP comes back as both EAP and WPA. EAP has to win: it is the
   one that needs a username, and the headset configures it a different way. */
function strongestAuth(list) {
  const names = (list || []).map(String);
  for (const a of ["EAP", "WPA", "WEP"]) if (names.includes(a)) return a;
  return "NONE";
}

/* The headset sends the raw RSSI, so these are Android's own four-bar cuts. */
function signalBars(rssi) {
  if (typeof rssi !== "number") return 0;
  if (rssi >= -55) return 4;
  if (rssi >= -66) return 3;
  if (rssi >= -77) return 2;
  if (rssi >= -88) return 1;
  return 0;
}

/* WifiModule.validatePassword, checked on this side too. A length the headset
   will reject costs a round trip and comes back as BAD_ARGUEMENT; saying it
   before the send is both faster and clearer. */
function passwordProblem(auth, password) {
  const p = password || "";
  if (auth === "WPA") return p.length >= 8 && p.length <= 63 ? null : AUTH_RULE.WPA;
  if (auth === "WEP") {
    if (p.length === 5 || p.length === 13) return /^[\x20-\x7e]*$/.test(p) ? null : "A 5- or 13-character WEP key has to be ASCII.";
    if (p.length === 10 || p.length === 26) return /^[0-9a-fA-F]+$/.test(p) ? null : "A 10- or 26-character WEP key has to be hex digits.";
    return AUTH_RULE.WEP;
  }
  if (auth === "EAP") return p ? null : "An enterprise network needs a password.";
  return null;
}

/* What each Wi-Fi failure actually means, read off the handler that sends it.
   Two are easy to misread on their own: WIFI_NO_NETWORK is what a failed
   association returns even when the name was right, and WIFI_NO_INTERNET is not
   a failure to join at all. */
const WIFI_HINTS = {
  WIFI_NO_NETWORK:
    "The headset wrote the network down and then never associated with it. Usually that is the security type: it configures the connection from exactly what it was sent, so WPA sent as open — or the other way round — gets refused by the access point and reported as no network. Scan and press Join instead of typing, since the scan carries the right type. If it is not in the scan the headset genuinely cannot see it: check it is 2.4 or 5GHz rather than 6, that it is in range, and tick Hidden network if it does not broadcast its name.",
  WIFI_INVALID_AUTH: "The access point rejected the password.",
  WIFI_AUTH_TIMEOUT: "Authentication started and then stopped getting answers. Worth trying again.",
  WIFI_IP_CONFIG_FAIL: "The headset joined the network but never got an address — the router's DHCP did not answer.",
  WIFI_NO_INTERNET:
    "Not really a failure: the headset joined the network. It just could not reach Meta's servers over it within ten seconds, which is also what a captive portal waiting for someone to sign in looks like.",
  DEVICE_WIFI_ERROR: "The headset's Wi-Fi did not come up. Enable Wi-Fi, give it a few seconds, and try again.",
  BAD_ARGUEMENT: "The password does not fit the security type.",
  AUTHENTICATION_FAILURE: "A claimed headset wants its device secret before it will change anything. Fill the secret in above and authenticate.",
};

function wifiHint(res) {
  const code = (res && ((res.error && res.error.code) || res.codeName)) || "";
  return WIFI_HINTS[code] || null;
}

/* The plain-words line, then the code and the server's own debug string under
   it — the panel explains what came back without hiding it. */
function failureText(res) {
  const code = (res.error && res.error.code) || res.codeName || res.code;
  const detail = res.error && res.error.debug_details ? code + " — " + res.error.debug_details : String(code);
  const hint = wifiHint(res);
  return (hint ? hint + "\n\n" : "") + detail;
}

/* What the last status read said the headset knows about, kept so the Reconnect
   and Forget rows can offer those names instead of asking for them. */
function rememberWifi(client, status) {
  if (!status) return;
  client.wifi = {
    known: (status.known_networks || []).map((n) => n && n.ssid).filter(Boolean),
    current: (status.network && status.network.ssid) || null,
  };
}

let datalistSeq = 0;
function attachKnown(input, client) {
  const list = document.createElement("datalist");
  list.id = "wifi-known-" + ++datalistSeq;
  input.setAttribute("list", list.id);
  const fill = () => {
    list.innerHTML = "";
    for (const ssid of (client.wifi && client.wifi.known) || []) {
      const o = document.createElement("option");
      o.value = ssid;
      list.appendChild(o);
    }
  };
  input.addEventListener("focus", fill);
  fill();
  return list;
}

/* A .companion-field whose input can be put away — the security type decides
   whether a password or a username is a real question. */
function showField(entry, on) {
  if (!entry || !entry.input) return;
  const wrap = entry.input.closest(".companion-field");
  if (wrap) wrap.hidden = !on;
}

function labelledInput(label, type) {
  const wrap = document.createElement("label");
  wrap.className = "companion-field";
  const cap = document.createElement("span");
  cap.textContent = label;
  const input = document.createElement("input");
  input.type = type;
  input.autocomplete = "off";
  input.spellcheck = false;
  wrap.append(cap, input);
  return { wrap, input };
}

/* Scan, then Join. The point is that nothing here is typed except the password:
   the name and the security type come from the headset's own scan, which is the
   only place they are reliably right. */
function wifiPicker(client) {
  const wrap = document.createElement("div");
  wrap.className = "wifi";

  const bar = document.createElement("div");
  bar.className = "wifi-bar";
  const scanBtn = document.createElement("button");
  scanBtn.type = "button";
  scanBtn.textContent = "Scan for networks";
  const note = document.createElement("p");
  note.className = "wifi-note";
  note.textContent =
    "Ask the headset what it can see, then press Join. A network that does not broadcast its name will not appear — type that one in below and tick Hidden network.";
  bar.append(scanBtn, note);

  const list = document.createElement("ul");
  list.className = "wifi-list";
  list.hidden = true;

  const out = document.createElement("pre");
  out.className = "companion-result wifi-out";
  out.hidden = true;

  wrap.append(bar, list, out);

  let lastScan = [];

  function say(text, kind) {
    out.hidden = false;
    out.dataset.kind = kind || "";
    out.textContent = text;
  }

  scanBtn.addEventListener("click", scan);

  async function scan() {
    scanBtn.disabled = true;
    scanBtn.textContent = "Scanning…";
    note.dataset.kind = "";
    note.textContent = "Scanning. The headset switches its Wi-Fi on first if it is off, so give this a few seconds.";
    out.hidden = true;
    try {
      const status = await readStatus();
      const res = await client.execute("WIFI_SCAN", null);
      if (res.code !== 0) {
        say(failureText(res), "err");
        render([], status);
        return;
      }
      lastScan = (res.decoded && res.decoded.networks) || [];
      render(lastScan, status);
      note.textContent = lastScan.length
        ? "Press Join on the one you want. A network the headset has joined before does not ask for the password again."
        : "The headset saw nothing. If its Wi-Fi was off it is on now — scan again in a few seconds.";
    } catch (e) {
      say(e.message || "the scan failed", "err");
    } finally {
      scanBtn.disabled = false;
      scanBtn.textContent = "Scan again";
    }
  }

  /* Status is what marks a network as saved or current, and a saved network is
     the one that can be rejoined without a password. It is a nice-to-have
     though, so a headset that refuses it still gets a list. */
  async function readStatus() {
    try {
      const res = await client.execute("WIFI_STATUS", null);
      if (res.code !== 0) return null;
      rememberWifi(client, res.decoded);
      return res.decoded || null;
    } catch {
      return null;
    }
  }

  function render(networks, status) {
    list.innerHTML = "";
    list.hidden = false;

    const known = new Set(((status && status.known_networks) || []).map((n) => n && n.ssid).filter(Boolean));
    const current = (status && status.network && status.network.ssid) || null;

    const seen = new Set();
    const rows = [];
    for (const n of networks) {
      if (!n.ssid || seen.has(n.ssid)) continue;
      seen.add(n.ssid);
      rows.push({
        ssid: n.ssid,
        auth: strongestAuth(n.auth),
        rssi: typeof n.signal_level === "number" ? n.signal_level : null,
      });
    }
    // The headset sorts its scan weakest first. Nobody reads a list that way.
    rows.sort((a, b) => (b.rssi == null ? -999 : b.rssi) - (a.rssi == null ? -999 : a.rssi));
    // Saved networks the scan missed still take a Reconnect.
    for (const ssid of known) if (!seen.has(ssid)) rows.push({ ssid, auth: null, rssi: null });

    // A false bool is dropped on decode, so an absent flag is an off radio.
    const radioOff = status && !status.enabled;
    if (radioOff) list.appendChild(radioOffRow());
    for (const r of rows) list.appendChild(netRow(r, known.has(r.ssid), r.ssid === current));
    if (!rows.length && !radioOff) list.appendChild(emptyRow());
  }

  function emptyRow() {
    const li = document.createElement("li");
    li.className = "wifi-net";
    const p = document.createElement("p");
    p.className = "wifi-row wifi-note";
    p.textContent = "Nothing in range.";
    li.appendChild(p);
    return li;
  }

  function radioOffRow() {
    const li = document.createElement("li");
    li.className = "wifi-net";
    const row = document.createElement("div");
    row.className = "wifi-row";
    const name = document.createElement("span");
    name.className = "wifi-ssid";
    name.textContent = "Wi-Fi is off on the headset";
    const tags = document.createElement("span");
    tags.className = "wifi-tags";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Turn it on";
    btn.addEventListener("click", async () => {
      const res = await run(btn, "Turning on…", () => client.execute("WIFI_ENABLE", null));
      if (!res) return;
      if (res.code !== 0) say(failureText(res), "err");
      else await scan();
    });
    row.append(name, tags, btn);
    li.appendChild(row);
    return li;
  }

  function netRow(net, saved, isCurrent) {
    const li = document.createElement("li");
    li.className = "wifi-net";

    const row = document.createElement("div");
    row.className = "wifi-row";

    const sig = document.createElement("span");
    sig.className = "wifi-sig";
    sig.dataset.level = String(signalBars(net.rssi));
    sig.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 4; i++) sig.appendChild(document.createElement("i"));

    const name = document.createElement("span");
    name.className = "wifi-ssid";
    name.textContent = net.ssid;

    const tags = document.createElement("span");
    tags.className = "wifi-tags";
    const parts = [];
    if (isCurrent) parts.push("connected");
    else if (saved) parts.push("saved");
    parts.push(net.auth ? AUTH_LABEL[net.auth] : "not in range");
    if (net.rssi != null) parts.push(net.rssi + " dBm");
    tags.textContent = parts.join(" · ");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = isCurrent ? "Rejoin" : saved ? "Reconnect" : "Join";

    row.append(sig, name, tags, btn);
    li.appendChild(row);

    let form = null;
    const openForm = (message) => {
      if (!form) {
        form = joinForm(net, (payload, submitBtn) => runConnect(payload, net.ssid, submitBtn));
        li.appendChild(form);
      }
      form.hidden = false;
      if (message) {
        const n = form.querySelector(".wifi-note");
        n.dataset.kind = "err";
        n.textContent = message;
      }
      const first = form.querySelector("input");
      if (first) first.focus();
    };

    btn.addEventListener("click", async () => {
      /* Saved means the headset already holds the password, so the shortest
         true path is a reconnect. If that does not take, the password form
         appears — which is the only moment anyone needs to see it. */
      if (saved || isCurrent) {
        const res = await run(btn, "Reconnecting…", () => client.execute("WIFI_RECONNECT", { ssid: net.ssid }));
        if (!res) return;
        if (res.code === 0) {
          say("Reconnected to " + net.ssid + ".", "ok");
          refresh();
          return;
        }
        say(failureText(res), "err");
        if (net.auth && net.auth !== "NONE") openForm("That did not take. Enter the password for " + net.ssid + ".");
        return;
      }
      if (net.auth === "NONE") {
        await runConnect({ ssid: net.ssid, auth: WIFI_AUTH.NONE, hidden: false }, net.ssid, btn);
        return;
      }
      openForm();
    });

    return li;
  }

  function joinForm(net, submit) {
    const auth = net.auth || "WPA";
    const form = document.createElement("form");
    form.className = "wifi-form";

    let username = null;
    if (auth === "EAP") {
      username = labelledInput("Username", "text");
      form.appendChild(username.wrap);
    }
    const password = labelledInput("Password", "password");
    form.appendChild(password.wrap);

    const reveal = document.createElement("button");
    reveal.type = "button";
    reveal.className = "ptc-btn";
    reveal.textContent = "Show";
    reveal.addEventListener("click", () => {
      const hidden = password.input.type === "password";
      password.input.type = hidden ? "text" : "password";
      reveal.textContent = hidden ? "Hide" : "Show";
    });
    form.appendChild(reveal);

    const go = document.createElement("button");
    go.type = "submit";
    go.textContent = "Join";
    form.appendChild(go);

    const rule = document.createElement("p");
    rule.className = "wifi-note";
    rule.textContent = AUTH_RULE[auth] || "";
    form.appendChild(rule);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const problem = passwordProblem(auth, password.input.value);
      if (problem) {
        rule.dataset.kind = "err";
        rule.textContent = problem;
        return;
      }
      rule.dataset.kind = "";
      rule.textContent = AUTH_RULE[auth] || "";
      const payload = { ssid: net.ssid, auth: WIFI_AUTH[auth], password: password.input.value, hidden: false };
      if (username) payload.username = username.input.value.trim();
      submit(payload, go);
    });

    return form;
  }

  /* Every button in here disables itself and says what it is doing, because the
     headset can sit on a join for the best part of a minute. */
  async function run(btn, busyLabel, fn) {
    const was = btn.textContent;
    btn.disabled = true;
    btn.textContent = busyLabel;
    try {
      return await fn();
    } catch (e) {
      say(e.message || "the request failed", "err");
      return null;
    } finally {
      btn.disabled = false;
      btn.textContent = was;
    }
  }

  async function runConnect(payload, ssid, btn) {
    say("Asking the headset to join " + ssid + ". This can take up to a minute: it waits for the access point, then checks it can reach Meta's servers.", "");
    const res = await run(btn, "Joining…", () => client.execute("WIFI_CONNECT", payload));
    if (!res) return null;
    if (res.code === 0) {
      say("Connected to " + ssid + ".", "ok");
      refresh();
      return res;
    }
    const code = (res.error && res.error.code) || res.codeName;
    if (code === "WIFI_NO_INTERNET") {
      say("Joined " + ssid + ". " + WIFI_HINTS.WIFI_NO_INTERNET, "");
      refresh();
      return res;
    }
    say(failureText(res), "err");
    return res;
  }

  /* After a join the saved and connected tags are stale, so re-read status and
     redraw from the scan already in hand rather than scanning again. */
  async function refresh() {
    const status = await readStatus();
    render(lastScan, status);
  }

  return wrap;
}

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
    this.wifi = { known: [], current: null }; // last WIFI_STATUS, for the SSID suggestions
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

    const raw = await this.#poll(METHOD_TIMEOUT[methodName] || REQUEST_TIMEOUT);
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
    const started = Date.now();
    const deadline = started + timeout;
    let buf = new Uint8Array(0);
    let expected = 0;
    /* A quick command answers in a few reads, so poll tightly at first; a Wi-Fi
       join can hold the line for a minute, and reading every 25ms for that long
       is a lot of BLE traffic for nothing. */
    const idle = () => sleep(Date.now() - started > 3000 ? 250 : 25);
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
        await idle();
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
    forgetSecret: section.querySelector("#companionForgetSecret"),
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

  /* One headset fills the box; several fill the picker instead, so the reader
     says which. Both the account query and what was remembered from last time
     land here, so they arrive the same way. */
  const offerSecrets = (found, remembered = false) => {
    if (found.length === 1) {
      el.secret.value = found[0].hex;
      el.secretPick.hidden = true;
      const who = esc(found[0].label || "your headset");
      setState(
        remembered
          ? `Not connected — using the secret remembered for ${who}.`
          : `Filled the secret for ${who}.`,
        remembered ? "" : "ok"
      );
      return;
    }

    el.secretPick.innerHTML = '<option value="">Pick a headset…</option>';
    for (const f of found) {
      const o = document.createElement("option");
      o.value = f.hex;
      o.textContent = f.label || f.hex.slice(0, 8) + "…";
      el.secretPick.appendChild(o);
    }
    el.secretPick.hidden = false;
    setState(
      remembered
        ? `Not connected — ${found.length} remembered headsets, pick one to fill its secret.`
        : `Found ${found.length} headsets — pick one to fill its secret.`,
      remembered ? "" : "ok"
    );
  };

  /* Nothing to forget until something has been kept. */
  const syncForget = () => {
    el.forgetSecret.disabled = !loadSecrets().length;
  };

  /* Keep a secret for next time, and let the Forget button light up for it. */
  const remember = (found) => {
    saveSecrets(found);
    syncForget();
  };

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
      remember(found);
      offerSecrets(found);
    } catch (e) {
      setState(e.message || "could not fetch the device secret", "warn");
    } finally {
      el.fetchSecret.disabled = false;
      el.fetchSecret.textContent = was;
    }
  });

  /* The cookie is the one thing here that outlives the page, so there is a
     button that takes it back. */
  el.forgetSecret.addEventListener("click", () => {
    clearSecrets();
    el.secret.value = "";
    el.secretPick.innerHTML = "";
    el.secretPick.hidden = true;
    syncForget();
    setState("Forgot the remembered secrets. Fetch secret gets them again.", "ok");
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
      /* It just proved itself against a real headset, so a secret typed by hand
         is kept the same way a fetched one is — under the headset's Bluetooth
         name, which is what the reader will recognise it by. */
      remember([{ label: client.deviceName || "", hex: el.secret.value.trim().toLowerCase() }]);
    } catch (e) {
      setState(e.message, "warn");
    } finally {
      el.auth.disabled = false;
    }
  });

  /* What was kept last time, so opening the tab does not mean fetching again.
     The box is only filled when it is empty, so anything typed this session
     wins over the cookie. */
  const kept = loadSecrets();
  syncForget();
  if (kept.length && !el.secret.value.trim()) offerSecrets(kept, true);

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

    /* Each tab is one entry: a label and a function that fills its panel. The
       Setup tab is assembled by hand and leads; the rest come straight from the
       schema's own @@tab grouping. */
    const sections = [];
    const setup = buildSetupSection(patches);
    if (setup) sections.push(setup);
    for (const feature of features) {
      sections.push({
        label: titleCase(feature.tab),
        fill: (panel) => {
          for (const group of feature.groups) panel.appendChild(renderGroup(group, patches));
        },
      });
    }

    sections.forEach((section, i) => {
      const tabBtn = document.createElement("button");
      tabBtn.type = "button";
      tabBtn.className = "companion-tab";
      tabBtn.textContent = section.label;
      tabBtn.addEventListener("click", () => selectTab(i));
      el.tabs.appendChild(tabBtn);

      const panel = document.createElement("div");
      panel.className = "companion-panel";
      panel.hidden = i !== 0;
      section.fill(panel);
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

  /* A consolidated first-run tab: the few things you do once when setting a
     headset up, pulled out of the tabs they normally live in — connect to Wi-Fi,
     push the device secret after a factory reset, set the combined account token,
     and skip the in-headset first-time setup. Every row is the same command the
     schema already defines, found by method name so this works whatever proto
     variant is loaded; a variant missing one just drops that row (and if it has
     none of them, there is no Setup tab). Nothing here is new protocol. */
  function buildSetupSection(patches) {
    const findCmd = (methodName) => {
      for (const f of deps.features)
        for (const g of f.groups) {
          if (g.primary && g.primary.methodName === methodName) return g.primary;
          const hit = g.secondary.find((c) => c.methodName === methodName);
          if (hit) return hit;
        }
      return null;
    };
    const findGroup = (methodName) => {
      for (const f of deps.features)
        for (const g of f.groups) {
          if (g.primary && g.primary.methodName === methodName) return g;
          if (g.secondary.some((c) => c.methodName === methodName)) return g;
        }
      return null;
    };
    // renderGroup grows the Wi-Fi picker from any group holding WIFI_CONNECT, so
    // the network step is just that group rendered here too.
    const wifiGroup = deps.methods.some((m) => m.name === "WIFI_CONNECT") ? findGroup("WIFI_CONNECT") : null;
    const secret = findCmd("OCULUS_SET_USER_SECRET");
    const combined = findCmd("META_SET_ACCESS_TOKEN_COMBINED");
    const nux = findCmd("NUX_COMPLETED");

    if (!wifiGroup && !secret && !combined && !nux) return null;

    // One command under a heading of our choosing, as a normal (non-primary) row.
    const solo = (title, cmd) => renderGroup({ title, primary: null, secondary: [cmd] }, patches);
    // A shallow retitle so a row can read the way this tab frames it, without
    // touching the shared command object.
    const retitled = (cmd, title) => ({ ...cmd, title });

    return {
      label: "Setup",
      fill: (panel) => {
        if (secret) panel.appendChild(solo("DEVICE SECRET", retitled(secret, "Set device secret on the headset")));
        if (combined) panel.appendChild(solo("COMBINED ACCOUNT TOKEN", combined));
        if (nux) panel.appendChild(solo("SKIP FIRST-TIME SETUP", retitled(nux, "Skip NUX (mark completed)")));
        if (wifiGroup) panel.appendChild(renderGroup(wifiGroup, patches));
      },
    };
  }

  function renderGroup(group, patches) {
    const wrap = document.createElement("section");
    wrap.className = "companion-group";
    const h = document.createElement("h3");
    h.textContent = group.title;
    wrap.appendChild(h);
    const cmds = [];
    if (group.primary) cmds.push([group.primary, true]);
    for (const c of group.secondary) cmds.push([c, false]);
    /* Whichever group the schema puts WIFI_CONNECT in, the picker leads it and
       the typed-in row sits underneath as the fallback. */
    if (cmds.some(([c]) => c.methodName === "WIFI_CONNECT")) wrap.appendChild(wifiPicker(client));
    for (const [c, primary] of cmds) wrap.appendChild(renderCommand(c, patches, primary));
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
    if (patch && patch.onForm) patch.onForm(inputs);

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
      try {
        if (cmd.fixed) payload = cmd.fixed;
        else if (patch && patch.build) {
          payload = patch.build(readForm(params, inputs));
          if (payload === null) return; // cancelled / invalid
        } else if (cmd.custom) {
          payload = readForm(params, inputs, true);
        } else {
          payload = params.length ? readForm(params, inputs) : null;
        }
      } catch (err) {
        // A payload that will not build says why here rather than on the wire.
        showResult(out, { code: -1, error: { message: err.message } }, true);
        return;
      }

      btn.disabled = true;
      const was = btn.textContent;
      btn.textContent = "…";
      try {
        const res = await client.execute(cmd.methodName, payload);
        if (cmd.methodName === "WIFI_STATUS" && res.code === 0) rememberWifi(client, res.decoded);
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
        o.textContent = labelFor(name.toLowerCase());
        input.appendChild(o);
      }
    } else if (p.type === "choice") {
      // A hand-written list: the value the request wants, said the way a reader
      // would say it.
      input = document.createElement("select");
      for (const [val, text] of p.values) {
        const o = document.createElement("option");
        o.value = val;
        o.textContent = text;
        input.appendChild(o);
      }
      if (p.default) input.value = p.default;
    } else {
      input = document.createElement("input");
      input.type = p.type === "password" ? "password" : p.type === "number" ? "number" : "text";
      if (p.type === "raw") input.placeholder = "hex or JSON";
      input.autocomplete = "off";
      input.spellcheck = false;
      if (p.suggest === "known") wrap.appendChild(attachKnown(input, client));
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
      const hint = wifiHint(res);
      if (hint) msg += "\n\n" + hint;
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
