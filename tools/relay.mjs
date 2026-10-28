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
import { pipeline } from "node:stream/promises";
import { readFileSync } from "node:fs";

const PORT = Number(process.env.PORT) || 8788;
const ALLOWED = /^https:\/\/(graph|www|securecdn(-[a-z0-9-]+)?)\.oculus\.com\//;

/* Every request goes out as the headset's own app manager (OCMS) sends it: its
   User-Agent (carrying the OCMS version), the OS build header, and the language
   replies are written in. One file holds them for every relay and the site:
   data/ocms-headers.json. Read once, at start. */
const OCMS_HEADERS = JSON.parse(readFileSync(new URL("../data/ocms-headers.json", import.meta.url), "utf8"));

/* Some builds are only served to the headset they were made for: the CDN reads
   the device out of the User-Agent and refuses the rest. Build records do not say
   which headset that is, so a refused download is asked again as each headset in
   data/ocms-devices.json in turn — the same User-Agent with the device swapped in. */
const OCMS_DEVICES = JSON.parse(readFileSync(new URL("../data/ocms-devices.json", import.meta.url), "utf8"));
const asDevice = (ua, device) =>
  ua.replace(/(; )[^;]+?( Build\/)/, `$1${device}$2`).replace(/FBDV\/[^;]*/, `FBDV/${device}`);

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

    const download = new URL(target).hostname.startsWith("securecdn");
    const isPost = req.method === "POST";

    /* Read the form body for a POST so it can be handed on. GraphQL requests
       come this way now — doc_id, variables and token in the body rather than
       the query string — so DevTools shows them as form fields. */
    let inBody;
    if (isPost) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      inBody = Buffer.concat(chunks);
    }

    try {
      const init = {
        method: isPost ? "POST" : "GET",
        headers: {
          ...OCMS_HEADERS,
          ...(download
            ? { Accept: "*/*" }
            : isPost
              ? {
                  "Content-Type":
                    req.headers["content-type"] || "application/x-www-form-urlencoded",
                  Accept: "application/json",
                }
              : { Accept: "application/json" }),
        },
        body: isPost ? inBody : undefined,
      };
      let upstream = await fetch(target, init);
      if (download) {
        const tried = new Set([OCMS_HEADERS["User-Agent"]]);
        for (const device of OCMS_DEVICES) {
          if (upstream.ok) break;
          const ua = asDevice(OCMS_HEADERS["User-Agent"], device);
          if (tried.has(ua)) continue;
          tried.add(ua);
          console.log(upstream.status, "refused; asking again as", device);
          await upstream.body?.cancel();
          upstream = await fetch(target, { ...init, headers: { ...init.headers, "User-Agent": ua } });
        }
      }

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
      /* pipeline, not pipe: a connection dropped mid-download on either side
         destroys both streams instead of crashing the relay with an unhandled
         'error' or leaving the upstream transfer running. */
      if (upstream.body) {
        pipeline(Readable.fromWeb(upstream.body), res).catch((err) => {
          console.error("stream ended early:", err.message);
        });
      } else res.end();
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
