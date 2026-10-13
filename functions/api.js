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
const ALLOWED = /^(graph|securecdn(-[a-z0-9-]+)?)\.oculus\.com$/;

/* Every request goes out as the headset's own app manager (OCMS) sends it: its
   User-Agent, which carries the OCMS version (FBAV/1048.0.0.115.1326, build
   FBBV/584111364), and the OS build header beside it. Read off a Quest 3: OCMS
   from `dumpsys package com.oculus.ocms`, the rest from getprop
   (ro.build.version.incremental, ro.vros.build.version for FBHV). Update all
   three relays together — tools/relay.mjs, functions/api.js and the headset
   app's Relay.java. `User-Agent` is a forbidden header name in a browser, which
   is the other reason downloads come through here rather than going straight
   to the CDN. */
const OCMS_UA =
  "Dalvik/2.1.0 (Linux; U; Android 14; Quest 3 Build/UP1A.231005.007.A1) " +
  "[FBAN/OculusOCMS;FBAV/1048.0.0.115.1326;FBCR/null;FBDV/Quest 3;FBHV/209;" +
  "FBLC/en_US;FBSV/14;FBSBT/user;FBBD/oculus;FBBV/584111364;" +
  "FBCA/arm64-v8a:armeabi-v7a:armeabi;FBMF/Oculus;FBPN/com.oculus.ocms;" +
  "FBDW/null;FBVM/null;]";
/* The headset OS build OCMS names with it (Build.VERSION.INCREMENTAL). */
const OCMS_BUILD = "52641960021500520";
/* The language replies are written in: dates, number formats and store text in
   US English, wherever the relay runs. It does not pick the currency — Meta
   prices by where the request comes from. */
const LANGUAGE = "en-US,en;q=0.6";

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

  const download = host.startsWith("securecdn");
  const isPost = request.method === "POST";

  const upstream = await fetch(target, {
    method: isPost ? "POST" : "GET",
    headers: {
      "User-Agent": OCMS_UA,
      "X-Build-Version-Incremental": OCMS_BUILD,
      "Accept-Language": LANGUAGE,
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
