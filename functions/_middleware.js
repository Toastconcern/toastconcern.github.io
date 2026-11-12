/* Keeps the site's relays for the site.
 *
 * /api, /dl (downloads) and /frl exist so MetaDB's own pages can reach Meta. Left open, any script
 * or other website could use them as a free proxy, and every request they made
 * would come out of the free plan's daily allowance (100,000 Function requests),
 * which runs out for everyone at once. So these answer only requests that a
 * browser says came from this site.
 *
 * How a request is judged:
 *   - Sec-Fetch-Site, which every current browser sends and no web page can set:
 *     "same-origin" is this site's own pages, workers and service worker; "none"
 *     is a person opening a link themselves (a copied Download link). Anything
 *     else, another site or a cross-site embed, is refused.
 *   - Browsers too old to send it (the Quest 1's Chrome 74, older Safari): the
 *     Origin or Referer must name this host.
 *   - Neither header at all (curl, scripts, bots): refused.
 *
 * A determined script can fake these headers, so this is a fence, not a lock: it
 * stops other websites outright (a browser will not let a page lie about them)
 * and stops casual scraping. The headset app is unaffected — it runs its own
 * relay. Other paths (static files) pass straight through.
 */

const GUARDED = new Set(["/api", "/dl", "/frl"]);

/* Pages elsewhere that MetaDB itself sends to the relay: the FRL-token snippet on
   Settings runs in the console on auth.meta.com and calls /api from there. A
   browser always sets Origin truthfully on those cross-site calls. */
const ALSO_ALLOWED = new Set(["https://auth.meta.com"]);

function fromThisSite(request) {
  const host = new URL(request.url).host;
  if (ALSO_ALLOWED.has(request.headers.get("Origin"))) return true;
  const site = request.headers.get("Sec-Fetch-Site");
  if (site) return site === "same-origin" || site === "none";

  for (const name of ["Origin", "Referer"]) {
    const value = request.headers.get(name);
    if (!value) continue;
    try {
      return new URL(value).host === host;
    } catch {
      return false;
    }
  }
  return false;
}

export async function onRequest({ request, next }) {
  const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
  if (!GUARDED.has(path) || request.method === "OPTIONS" || fromThisSite(request)) {
    return next();
  }
  return new Response(
    JSON.stringify({ error: { message: "this relay only answers MetaDB's own pages" } }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        /* Marked like every relay reply, so the page never reads it as "no relay here". */
        "X-MetaDB-Relay": "refused",
      },
    }
  );
}
