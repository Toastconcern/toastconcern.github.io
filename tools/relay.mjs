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
 * Binary downloads come through here too, for a second reason: they want the
 * companion app's `User-Agent`, and that is a forbidden header name in a
 * browser. Not being a browser, this can set it.
 *
 * Local use only. It will forward any URL it is given to anyone who asks, so do
 * not put it on a public address.
 */

import http from "node:http";
import { Readable } from "node:stream";

const PORT = Number(process.env.PORT) || 8788;
const ALLOWED = /^https:\/\/(graph|www|securecdn)\.oculus\.com\//;

/* What the Oculus companion app on a Quest 3 sends when it pulls a binary. */
const DOWNLOAD_UA =
  "Dalvik/2.1.0 (Linux; U; Android 14; Quest 3 Build/UP1A.231005.007.A1) " +
  "[FBAN/OculusOCMS;FBAV/1046.0.0.121.1350;FBCR/null;FBDV/Quest 3;FBHV/204;" +
  "FBLC/en_US;FBSV/14;FBSBT/user;FBBD/oculus;FBBV/582512031;" +
  "FBCA/arm64-v8a:armeabi-v7a:armeabi;FBMF/Oculus;FBPN/com.oculus.ocms;" +
  "FBDW/null;FBVM/null;]";

/* Content-Disposition is what makes the browser save an APK under its own name
   rather than calling it after this endpoint.

   Content-Length is deliberately not in this list. `fetch` asks for gzip and
   unpacks the reply before handing it over, so upstream's length describes
   bytes that no longer exist — passing it on makes the browser stop reading
   early and truncate the body. Length is set below, only when it still holds. */
const PASS = ["content-type", "content-disposition"];

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

    const download = new URL(target).hostname === "securecdn.oculus.com";

    try {
      const upstream = await fetch(target, {
        headers: download
          ? { Accept: "*/*", "User-Agent": DOWNLOAD_UA }
          : { Accept: "application/json" },
      });

      /* Log the path only. The query string carries the access token and this
         output tends to end up pasted into chats and issues. */
      const safe = new URL(target);
      console.log(upstream.status, safe.origin + safe.pathname);

      const headers = {};
      for (const name of PASS) {
        const value = upstream.headers.get(name);
        if (value) headers[name] = value;
      }
      headers["content-type"] ??= download
        ? "application/octet-stream"
        : "application/json";

      /* An untouched body still has the length it arrived with, and a download
         wants it — it is what turns the browser's progress into a percentage
         instead of a rising byte count. Anything encoded goes out chunked. */
      const encoding = upstream.headers.get("content-encoding");
      const length = upstream.headers.get("content-length");
      if (length && (!encoding || encoding === "identity")) {
        headers["content-length"] = length;
      }

      res.writeHead(upstream.status, headers);

      /* Streamed rather than buffered: an APK is measured in gigabytes, and
         reading one as text would corrupt it on the way through. */
      if (upstream.body) Readable.fromWeb(upstream.body).pipe(res);
      else res.end();
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
