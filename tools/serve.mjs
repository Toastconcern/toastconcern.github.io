// Local dev server: node tools/serve.mjs [port] [--no-adb] [--no-ocms-sync]   (from the repo root; default 8791)
//
// The one command for running MetaDB locally. It starts:
//   - the site, the way Cloudflare Pages serves it: a file if one exists, otherwise
//     index.html, so path links like /apps/<id>/builds or /settings open as they do
//     live. `python -m http.server` answers those with a 404. Nothing is cached, so
//     edits show on reload.
//   - the relay, answering /api?url=… and /dl?url=… (downloads) with tools/relay.mjs,
//     the same addresses the live site's relay has, so no relay URL is needed; and on
//     127.0.0.1:8788 as well, the address Settings → "use the local relay" saves, so a
//     relay URL set that way keeps working (and the live site can use it).
//   - the ADB bridge (tools/adb-bridge.mjs, 127.0.0.1:8789) for the ADB screen, as a
//     separate process: if adb is missing or the port is taken, the site still runs.
//     --no-adb leaves it out.
//   - OCMS sync (tools/ocms-sync.mjs): at start and every 10 minutes, a headset on adb
//     with a newer OCMS than the headers files writes its version and OS build to
//     data/ocms-headers-latest.json, which the relay then uses at once for requests
//     signed with a person's own token. data/ocms-headers.json (set by hand) stays what
//     everything else uses. --no-ocms-sync turns it off.
import { createServer } from "node:http";
import { relay, reloadHeaders } from "./relay.mjs";
import { syncOcms } from "./ocms-sync.mjs";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, resolve, sep } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(".");
const args = process.argv.slice(2);
const port = Number(args.find((a) => /^\d+$/.test(a)) ?? 8791);
const withAdb = !args.includes("--no-adb");
const withOcmsSync = !args.includes("--no-ocms-sync");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".proto": "text/plain; charset=utf-8",
  ".zip": "application/zip",
  ".apk": "application/vnd.android.package-archive",
};

async function handle(req, res) {
  let path;
  try {
    path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    return res.writeHead(400).end();
  }
  if (path === "/api" || path === "/dl") return relay(req, res);
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(root, path));
  if (file !== root && !file.startsWith(root + sep)) return res.writeHead(403).end();

  const headers = { "Cache-Control": "no-store" };
  try {
    if ((await stat(file)).isFile()) {
      res.writeHead(200, { ...headers, "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
      return res.end(await readFile(file));
    }
  } catch {}

  /* A missing file with an extension (an image, a script) is a real 404; anything
     else is a link into the site, and gets the page. */
  if (extname(path)) return res.writeHead(404, headers).end("Not found");
  res.writeHead(200, { ...headers, "Content-Type": TYPES[".html"] });
  res.end(await readFile(join(root, "index.html")));
}

/* "localhost" is IPv6 (::1) first in most browsers and IPv4 (127.0.0.1) in others,
   so both are listened on — this machine only, never the network. If either is
   already taken (another server on this port), nothing starts: half a server is
   worse than none, since the browser would keep reaching the other one. */
const hosts = ["127.0.0.1", "::1"];
const servers = [];
for (const host of hosts) {
  const s = createServer(handle);
  servers.push(
    new Promise((ok, fail) => {
      s.once("error", (err) => fail(Object.assign(err, { host })));
      s.listen(port, host, () => ok(s));
    })
  );
}
Promise.allSettled(servers).then((results) => {
  const failed = results.filter((r) => r.status === "rejected").map((r) => r.reason);
  const ipv6Missing = failed.length === 1 && failed[0].host === "::1" && failed[0].code === "EADDRNOTAVAIL";
  if (failed.length && !ipv6Missing) {
    for (const r of results) if (r.status === "fulfilled") r.value.close();
    const busy = failed.find((e) => e.code === "EADDRINUSE");
    console.error(
      busy
        ? `Port ${port} is already in use by another server (on ${busy.host}). Stop it first — ` +
            `an old "python -m http.server ${port}" is the usual one — or pick another port: node tools/serve.mjs 8795`
        : `Could not start: ${failed[0].message}`
    );
    process.exit(1);
  }
  console.log(`MetaDB on http://localhost:${port}/  (store relay built in at /api and /dl)`);
  startRelayPort();
  if (withAdb) startAdbBridge();
  if (withOcmsSync) startOcmsSync();
  console.log("Ctrl+C stops everything.");
});

/* OCMS headers from a connected headset, when it is newer than the file. Quiet when
   nothing changes, so the 10-minute check does not fill the console. */
function startOcmsSync() {
  let quietAdbMissing = false;
  const run = async () => {
    const r = await syncOcms({ log: (m) => quietAdbMissing || console.log(m) });
    quietAdbMissing = true;
    if (r.written) {
      reloadHeaders();
      console.log(`OCMS sync from your headset: ${r.changes.join("; ")}. data/ocms-headers-latest.json updated (signed-in requests); push it to use it live.`);
    }
  };
  run();
  setInterval(run, 10 * 60 * 1000).unref();
}

/* The relay on its own port too, for a Relay URL of http://127.0.0.1:8788/?url={url}
   saved in Settings. Optional: if the port is taken (a standalone relay.mjs already
   running), that one answers instead and nothing is lost. */
function startRelayPort() {
  const RELAY_PORT = 8788;
  createServer(relay)
    .once("error", (err) =>
      console.log(err.code === "EADDRINUSE" ? `Port ${RELAY_PORT} is taken; the relay there is not this one.` : `Relay port ${RELAY_PORT}: ${err.message}`)
    )
    .listen(RELAY_PORT, "127.0.0.1", () => console.log(`Relay also on http://127.0.0.1:${RELAY_PORT}/?url={url}`));
}

/* The ADB bridge in its own process, its output passed through. It is stopped with
   this one, and when it cannot start (adb missing, port 8789 taken) it says why and
   the site carries on without it. */
function startAdbBridge() {
  const bridge = spawn(process.execPath, [fileURLToPath(new URL("./adb-bridge.mjs", import.meta.url))], {
    stdio: "inherit",
  });
  bridge.on("exit", (code, signal) => {
    if (!signal && code) console.error(`ADB bridge stopped (exit ${code}); the site is still running. The ADB screen needs it.`);
  });
  const stop = () => bridge.exitCode === null && bridge.kill();
  process.on("exit", stop);
  for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => process.exit(0));
}
