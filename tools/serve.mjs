// Local dev server: node tools/serve.mjs [port]   (from the repo root; default 8791)
//
// Serves the site the way Cloudflare Pages does in production: a file if one
// exists, otherwise index.html, so path links like /apps/<id>/builds or
// /settings open as they do live. `python -m http.server` answers those with
// a 404, which is why this exists. Nothing is cached, so edits show on reload.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.argv[2] ?? 8791);
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
  if (path.endsWith("/")) path += "index.html";
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) return res.writeHead(403).end();

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
  console.log(`MetaDB on http://localhost:${port}/`);
});
