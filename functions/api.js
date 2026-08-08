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

  const upstream = await fetch(target, {
    headers: { Accept: "application/json" },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      /* Same origin as the page, so this is belt and braces. */
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
