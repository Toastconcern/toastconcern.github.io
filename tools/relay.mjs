/* A minimal CORS relay for local development.
 *
 *   node tools/relay.mjs
 *
 * Then on the Settings page set the relay URL to:
 *
 *   http://127.0.0.1:8788/?url={url}
 *
 * Why this is needed: graph.oculus.com answers with
 * `Access-Control-Allow-Origin: https://facebook.com`, so a browser on any other
 * address is refused the response. That is decided by the page's origin, not by
 * the token — which is why the same request works fine in Insomnia or curl.
 * This process is not a browser, so it can fetch the URL and hand it back with
 * headers your page is allowed to read.
 *
 * Local use only. It will forward any URL it is given to anyone who asks, so do
 * not put it on a public address.
 */

import http from "node:http";

const PORT = Number(process.env.PORT) || 8788;
const ALLOWED = /^https:\/\/(graph|www)\.oculus\.com\//;

http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    const target = new URL(req.url, "http://localhost").searchParams.get("url");

    if (!target) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: { message: "no url parameter" } }));
    }

    if (!ALLOWED.test(target)) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: { message: "only oculus.com URLs are relayed" } })
      );
    }

    try {
      const upstream = await fetch(target, { headers: { Accept: "application/json" } });
      const body = await upstream.text();

      /* Log the path only. The query string carries the access token and this
         output tends to end up pasted into chats and issues. */
      const safe = new URL(target);
      console.log(upstream.status, safe.origin + safe.pathname);

      res.writeHead(upstream.status, { "Content-Type": "application/json" });
      res.end(body);
    } catch (err) {
      console.error("failed:", err.message);
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: { message: String(err.message) } }));
    }
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`relay listening on http://127.0.0.1:${PORT}`);
    console.log(`settings relay URL:  http://127.0.0.1:${PORT}/?url={url}`);
  });
