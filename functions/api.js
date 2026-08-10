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

/* Only these hosts are forwarded. Without the check this is an open proxy that
   anyone who finds the address can fetch arbitrary sites through. */
const ALLOWED = /^(graph|securecdn)\.oculus\.com$/;

/* Binary downloads are asked for by a headset, so they are answered as one.
   This is what the Oculus companion app on a Quest 3 sends. `User-Agent` is a
   forbidden header name in a browser, which is the other reason downloads come
   through here rather than going straight to the CDN. */
const DOWNLOAD_UA =
  "Dalvik/2.1.0 (Linux; U; Android 14; Quest 3 Build/UP1A.231005.007.A1) " +
  "[FBAN/OculusOCMS;FBAV/1046.0.0.121.1350;FBCR/null;FBDV/Quest 3;FBHV/204;" +
  "FBLC/en_US;FBSV/14;FBSBT/user;FBBD/oculus;FBBV/582512031;" +
  "FBCA/arm64-v8a:armeabi-v7a:armeabi;FBMF/Oculus;FBPN/com.oculus.ocms;" +
  "FBDW/null;FBVM/null;]";

/* Headers worth carrying back. Content-Disposition is what makes the browser
   save an APK under its own name instead of showing it as "api".

   Content-Length is deliberately absent. `fetch` asks for gzip and unpacks the
   reply before handing it over, so upstream's length counts bytes that are no
   longer there — passing it on makes the browser stop reading early and
   truncate the body. It is set below, only where it still holds. */
const PASS = ["Content-Type", "Content-Disposition"];

export async function onRequest({ request }) {
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

  const download = host === "securecdn.oculus.com";

  const upstream = await fetch(target, {
    headers: download
      ? { Accept: "*/*", "User-Agent": DOWNLOAD_UA }
      : { Accept: "application/json" },
  });

  const headers = new Headers({
    /* Same origin as the page, so this is belt and braces. */
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
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
