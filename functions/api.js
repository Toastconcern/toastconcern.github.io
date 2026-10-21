/* Cloudflare Pages Function — the relay, served from the site's own origin.
 *
 * With this deployed there is no relay to configure: the page calls /api?url=…
 * on its own domain, so no cross-origin rule applies and the browser never has
 * to be talked round. It only exists because graph.oculus.com answers with
 * `Access-Control-Allow-Origin: https://facebook.com`, which no token changes.
 *
 * Put this file at functions/api.js in a Cloudflare Pages project. GitHub Pages
 * serves static files only and cannot run it — there, a separate relay URL in
 * Settings is still needed.
 */

/* Every request goes out as the headset's own app manager (OCMS) sends it: its
   User-Agent (carrying the OCMS version), the OS build header, and the language
   replies are written in. The values live in one file, data/ocms-headers.json,
   which this relay, tools/relay.mjs and the site (and through it the headset app)
   all read, so an OCMS version bump is one edit. `User-Agent` is a forbidden header
   name in a browser, which is the other reason downloads come through here rather
   than going straight to the CDN. */
import OCMS_HEADERS from "../data/ocms-headers.json";

/* Only these hosts are forwarded. Without the check this is an open proxy that
   anyone who finds the address can fetch arbitrary sites through. */
const ALLOWED = /^(graph|securecdn(-[a-z0-9-]+)?)\.oculus\.com$/;

/* Headers worth carrying back. Content-Disposition is what makes the browser
   save an APK under its own name instead of showing it as "api".

   Content-Length is deliberately absent. `fetch` asks for gzip and unpacks the
   reply before handing it over, so upstream's length counts bytes that are no
   longer there — passing it on makes the browser stop reading early and
   truncate the body. It is set below, only where it still holds. */
const PASS = ["Content-Type", "Content-Disposition"];

export async function onRequest({ request, env }) {
  const target = new URL(request.url).searchParams.get("url");
  if (!target) return new Response("no url", { status: 400 });

  let host;
  try {
    host = new URL(target).hostname;
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (!ALLOWED.test(host)) {
    return new Response("host not allowed", { status: 403 });
  }

  const download = host.startsWith("securecdn");
  const isPost = request.method === "POST";

  /* Store queries go through the US relay when it is bound (workers/relay-us):
     Meta prices by where a request comes from, and this function runs wherever
     Cloudflare serves the site — often Europe on the free plan. Downloads are not
     priced, so they stay direct. Unbound, or if the relay fails, it is direct too. */
  const viaUs = !download && env?.US_RELAY;
  const init = {
    method: isPost ? "POST" : "GET",
    headers: {
      ...OCMS_HEADERS,
      ...(download
        ? { Accept: "*/*" }
        : isPost
          ? {
              "Content-Type":
                request.headers.get("content-type") || "application/x-www-form-urlencoded",
              Accept: "application/json",
            }
          : { Accept: "application/json" }),
    },
    /* Form bodies are tiny, so read the text rather than streaming — simpler,
       and avoids the duplex-stream requirement. */
    body: isPost ? await request.text() : undefined,
  };
  let upstream = null;
  let route = "direct";
  if (viaUs) {
    try {
      upstream = await env.US_RELAY.fetch(target, init);
      route = "us";
    } catch {
      upstream = null;
    }
  }
  if (!upstream) {
    /* Unreachable upstream: answer with a marked 502 rather than letting the
       throw become Cloudflare's own HTML error page. */
    try {
      upstream = await fetch(target, init);
    } catch (err) {
      return new Response(JSON.stringify({ error: { message: String(err?.message ?? err) } }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-MetaDB-Relay": route },
      });
    }
  }

  const headers = new Headers({
    /* Same origin as the page, so this is belt and braces. */
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    /* Which way the reply came: "us" through the US relay, "direct" from here. */
    "X-MetaDB-Relay": route,
  });
  for (const name of PASS) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", download ? "application/octet-stream" : "application/json");
  }

  /* An untouched body still has the length it arrived with, and a download
     wants it — it is what turns the browser's progress into a percentage
     rather than a rising byte count. Anything encoded goes out chunked. */
  const encoding = upstream.headers.get("Content-Encoding");
  const length = upstream.headers.get("Content-Length");
  if (length && (!encoding || encoding === "identity")) {
    headers.set("Content-Length", length);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
