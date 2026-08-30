/* A small HTTP front end for the adb you already have.
 *
 *   node tools/adb-bridge.mjs
 *
 * Then open the ADB tab and press Find headsets.
 *
 * Why this rather than talking to the headset from the page: a browser can do
 * USB through WebUSB, but it has to authenticate with a key of its own, and the
 * headset has never seen that key — so every connection waits on an "Allow USB
 * debugging?" prompt inside the headset. Your machine's adb is already trusted
 * and already has a key the headset knows. Handing the work to it means no
 * prompt, no second key, and wireless for free through `adb connect`.
 *
 * Nothing here interprets ADB itself; it runs the adb binary and passes the
 * output back. Arguments are never concatenated into a shell string — they go
 * as an argv array, so a package name cannot turn into a command.
 *
 * Local use only.
 */

import http from "node:http";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";

const PORT = Number(process.env.PORT) || 8789;
const ADB = process.env.ADB || "adb";


/* A serial is what `adb devices` prints: a USB serial, or host:port when the
   headset was reached over the network. Anything else is refused rather than
   passed on. */
const SERIAL = /^[A-Za-z0-9._:-]{1,64}$/;
/* Only an app's own expansion directory. An APK install is adb's business, but
   a push is a write to an arbitrary path, so the path is pinned to the one
   place an OBB is allowed to live. */
const OBB_DEST =
  /^\/sdcard\/Android\/obb\/[A-Za-z0-9_][A-Za-z0-9_.]{0,254}\/[A-Za-z0-9_.-]{1,128}\.obb$/;
const PACKAGE = /^[A-Za-z0-9_][A-Za-z0-9_.]{0,254}$/;
const ADDRESS = /^[A-Za-z0-9.-]{1,64}(:\d{1,5})?$/;

function adb(args, { timeout = 120000, maxBuffer = 1 << 26 } = {}) {
  return new Promise((resolve, reject) => {
    execFile(ADB, args, { timeout, maxBuffer }, (err, stdout, stderr) => {
      if (err) {
        const raw = (stderr || stdout || err.message).trim();
        /* adb names the serial it could not find, which reads like a fault in
           the request rather than what it is: that headset has gone. It goes
           when the cable comes out, and the wireless one is a different serial
           entirely. */
        const why =
          err.code === "ENOENT"
            ? `adb not found — put it on PATH, or set ADB=/full/path/to/adb`
            : /device .*not found/i.test(raw)
              ? "that headset is no longer connected — if you unplugged it, " +
                "connect again over wireless"
              : raw;
        reject(new Error(why));
        return;
      }
      resolve(String(stdout));
    });
  });
}

/* ---------- what adb tells us ---------- */

async function devices() {
  const text = await adb(["devices", "-l"], { timeout: 20000 });
  return text
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [serial, state, ...rest] = line.split(/\s+/);
      const info = Object.fromEntries(
        rest
          .filter((part) => part.includes(":"))
          .map((part) => part.split(":"))
      );
      return {
        serial,
        state,
        model: (info.model || info.device || "").replace(/_/g, " "),
        wireless: serial.includes(":"),
      };
    })
    .filter((d) => SERIAL.test(d.serial));
}

/* Third-party packages and the version each is on. `pm list packages -3` gives
   the names; the versions come from one dumpsys rather than a call per app. */
async function packages(serial) {
  const list = await adb(["-s", serial, "shell", "pm", "list", "packages", "-3"]);
  const names = list
    .split("\n")
    .map((l) => l.trim().replace(/^package:/, ""))
    .filter(Boolean);

  const dump = await adb(["-s", serial, "shell", "dumpsys", "package", "packages"], {
    maxBuffer: 1 << 28,
  });

  const versions = new Map();
  let current = null;
  for (const line of dump.split("\n")) {
    const header = line.match(/^\s*Package \[([^\]]+)\]/);
    if (header) {
      current = header[1];
      continue;
    }
    if (!current) continue;
    const code = line.match(/versionCode=(\d+)/);
    const name = line.match(/versionName=(\S+)/);
    if (code || name) {
      const entry = versions.get(current) ?? { version: null, versionCode: null };
      if (code) entry.versionCode = Number(code[1]);
      if (name) entry.version = name[1];
      versions.set(current, entry);
    }
  }

  return names
    .map((packageName) => ({
      packageName,
      version: versions.get(packageName)?.version ?? null,
      versionCode: versions.get(packageName)?.versionCode ?? null,
    }))
    .sort((a, b) => a.packageName.localeCompare(b.packageName));
}

async function info(serial) {
  const get = (prop) =>
    adb(["-s", serial, "shell", "getprop", prop], { timeout: 15000 })
      .then((s) => s.trim())
      .catch(() => "");
  const [model, release] = await Promise.all([
    get("ro.product.model"),
    get("ro.build.version.release"),
  ]);
  return { serial, model: model || "headset", release };
}

/* ---------- the server ---------- */

const send = (res, status, body) => {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Cache-Control": "no-store",
  });
  res.end(text);
};

const body = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      /* An APK, not a novel — but 4GB of nonsense should not be buffered. */
      if (size > 4 * 1024 * 1024 * 1024) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

http
  .createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      });
      return res.end();
    }

    const url = new URL(req.url, "http://localhost");
    const serial = url.searchParams.get("serial") ?? "";
    const route = url.pathname;

    const needSerial = () => {
      if (!SERIAL.test(serial)) throw new Error("bad or missing serial");
      return serial;
    };

    try {
      if (route === "/devices") {
        return send(res, 200, { devices: await devices() });
      }

      if (route === "/connect") {
        const addr = url.searchParams.get("addr") ?? "";
        if (!ADDRESS.test(addr)) throw new Error("bad address");
        const out = await adb(
          ["connect", addr.includes(":") ? addr : `${addr}:5555`],
          { timeout: 20000 }
        );
        /* adb says "connected"/"already connected", or explains itself. */
        if (!/connected/i.test(out)) throw new Error(out.trim() || "could not connect");
        return send(res, 200, { message: out.trim(), devices: await devices() });
      }

      if (route === "/pair" && req.method === "POST") {
        const addr = url.searchParams.get("addr") ?? "";
        const code = url.searchParams.get("code") ?? "";
        if (!ADDRESS.test(addr)) throw new Error("bad address");
        if (!/^\d{6}$/.test(code)) throw new Error("the pairing code is six digits");

        /* The pairing screen's port is not the one you connect on — it changes
           every time the dialog is opened, and the headset stops listening the
           moment it closes. */
        let out;
        try {
          out = await adb(["pair", addr, code], { timeout: 60000 });
        } catch (err) {
          /* What adb says when nothing answers on that port is a protocol
             fault, which explains nothing. The cause is nearly always the
             dialog having been closed, or its port having moved since. */
          throw /protocol fault|failed to connect|Connection refused/i.test(err.message)
            ? new Error(
                "nothing answered at that address — the pairing dialog has to " +
                  "still be open on the headset, and its port changes every " +
                  "time it is reopened"
              )
            : err;
        }
        if (!/Successfully paired/i.test(out)) {
          throw new Error(out.trim() || "pairing failed");
        }
        return send(res, 200, { message: out.trim() });
      }

      if (route === "/tcpip" && req.method === "POST") {
        const target = needSerial();
        /* Read the address *before* switching. `adb tcpip` restarts adbd on the
           headset, which drops this USB connection with it — anything asked
           afterwards is talking to a socket that has already gone. */
        let address = null;
        try {
          const routes = await adb(["-s", target, "shell", "ip", "route"], {
            timeout: 15000,
          });
          /* Take wlan0's line specifically. p2p0 has a route too, and its
             address belongs to the headset's own peer-to-peer network, which
             reaches nothing from here. */
          const wifi = /[^\r\n]*wlan0[^\r\n]*/.exec(routes)?.[0] ?? routes;
          const found = (wifi ?? routes).match(/src\s+(\d+\.\d+\.\d+\.\d+)/);
          if (found) address = `${found[1]}:5555`;
        } catch {
          /* The switch is what matters; the address is a convenience. */
        }

        const out = await adb(["-s", target, "tcpip", "5555"], { timeout: 30000 });
        return send(res, 200, { message: out.trim(), address });
      }

      if (route === "/info") {
        return send(res, 200, await info(needSerial()));
      }

      if (route === "/packages") {
        return send(res, 200, { apps: await packages(needSerial()) });
      }

      if (route === "/uninstall" && req.method === "POST") {
        const pkg = url.searchParams.get("package") ?? "";
        if (!PACKAGE.test(pkg)) throw new Error("bad package name");
        const out = await adb(["-s", needSerial(), "uninstall", pkg]);
        if (!/^Success/m.test(out)) throw new Error(out.trim() || "uninstall failed");
        return send(res, 200, { message: out.trim() });
      }

      if (route === "/push" && req.method === "POST") {
        const target = needSerial();
        const dest = url.searchParams.get("dest") ?? "";
        if (!OBB_DEST.test(dest)) throw new Error("bad destination");

        const payload = await body(req);
        if (!payload.length) throw new Error("nothing to push");

        const dir = dest.slice(0, dest.lastIndexOf("/"));
        const file = path.join(os.tmpdir(), `metadb-${randomUUID()}.obb`);
        await fs.writeFile(file, payload);
        try {
          await adb(["-s", target, "shell", "mkdir", "-p", dir]);
          const out = await adb(["-s", target, "push", file, dest], {
            timeout: 900000,
          });
          return send(res, 200, { message: out.trim() });
        } finally {
          await fs.rm(file, { force: true }).catch(() => {});
        }
      }

      if (route === "/install" && req.method === "POST") {
        const target = needSerial();
        const apk = await body(req);
        if (!apk.length) throw new Error("no apk in the request");

        const file = path.join(os.tmpdir(), `metadb-${randomUUID()}.apk`);
        await fs.writeFile(file, apk);
        try {
          /* -r keeps it an upgrade where it can be one; -d allows a lower
             version code, which is the whole point here and works when the
             build permits it. A store build that refuses still needs the
             uninstall the page warns about. */
          const out = await adb(["-s", target, "install", "-r", "-d", file], {
            timeout: 600000,
          });
          if (!/^Success/m.test(out)) throw new Error(out.trim() || "install failed");
          return send(res, 200, { message: out.trim() });
        } finally {
          await fs.rm(file, { force: true }).catch(() => {});
        }
      }

      send(res, 404, { error: "no such route" });
    } catch (err) {
      send(res, 400, { error: err.message });
    }
  })
  .listen(PORT, "127.0.0.1", async () => {
    console.log(`adb bridge listening on http://127.0.0.1:${PORT}`);
    try {
      const version = (await adb(["version"], { timeout: 10000 })).split("\n")[0];
      console.log(`using ${version.trim()}`);
      const found = await devices();
      console.log(
        found.length
          ? found.map((d) => `  ${d.serial}  ${d.state}  ${d.model}`).join("\n")
          : "  no headsets yet — plug one in, or use Connect wirelessly"
      );
    } catch (err) {
      console.error(`adb is not usable: ${err.message}`);
    }
  });
