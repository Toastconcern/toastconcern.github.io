/* Which OCMS headers a store request goes out with. Shared by functions/api.js (the
 * live relay), tools/relay.mjs and tools/ocms-sync.mjs; js/check.js carries the same
 * few lines for the headset app.
 *
 * Two sets:
 *   data/ocms-headers.json         set by hand. Every request uses these by default.
 *   data/ocms-headers-latest.json  the newest OCMS a headset of yours runs, written by
 *                                  tools/ocms-sync.mjs (serve.mjs runs it).
 * The latest set is used only for a request signed with a person's own token, and only
 * when it is actually newer than the hand-set one; anything on a public token (or none)
 * keeps the hand-set values.
 */

/* Public app tokens are "<kind>|<app id>|<secret, often empty>" (OC|…|, FRL|…|…); a
   person's own token (oc_www_at, oc_ac_at, an FRL account token) has no "|". */
export const isUserToken = (token) => typeof token === "string" && token.trim() !== "" && !token.includes("|");

/** The access_token of a request: in its query string, or in a form body. */
export function tokenOf(url, body) {
  try {
    const fromUrl = new URL(url).searchParams.get("access_token");
    if (fromUrl) return fromUrl;
  } catch {}
  if (typeof body === "string" && body) {
    try {
      return new URLSearchParams(body).get("access_token");
    } catch {}
  }
  return null;
}

const version = (h) => (h?.["User-Agent"]?.match(/FBAV\/([\d.]+)/)?.[1] ?? "").split(".").map((n) => Number(n) || 0);
const incremental = (h) => {
  try {
    return BigInt(h?.["X-Build-Version-Incremental"] || 0);
  } catch {
    return 0n;
  }
};

/** True when header set `b` carries a newer OCMS than `a` (version first, then OS build). */
export function isNewer(b, a) {
  const x = version(b);
  const y = version(a);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0);
  }
  return incremental(b) > incremental(a);
}

/** The headers for a request signed with `token`. */
export function pickHeaders(fixed, latest, token) {
  return isUserToken(token) && latest && isNewer(latest, fixed) ? latest : fixed;
}
