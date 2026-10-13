/* MetaDB's US relay — a Worker that asks Meta from the United States.
 *
 * Meta prices an app in the currency of wherever the request comes from, and a
 * Pages Function runs wherever Cloudflare happens to serve the site that day —
 * on the free plan, often Munich or Madrid, which comes back in euros. A Durable
 * Object, though, can be told where to live: this one is created with the
 * location hint "enam" (eastern North America), so its requests to Meta leave
 * from there and come back in US dollars, whichever data center took the call.
 *
 * Only the site's Pages Function reaches it, through a service binding named
 * US_RELAY; workers_dev is off in wrangler.toml, so it has no public address.
 * The function hands over the request exactly as it would have sent it — URL,
 * method, OCMS headers, body — and gets Meta's reply back untouched.
 */

/* The same rule as the Pages Function: store queries only. Downloads are not
   priced, so they stay on the direct path, and nothing else is forwarded. */
const ALLOWED = /^graph\.oculus\.com$/;

/* Where the object is created. Cloudflare places it in a data center in that
   region; "enam" is eastern North America. Change it here to price elsewhere
   ("wnam" western North America, "weur" western Europe, "apac", "oc", …). */
const REGION = "enam";

export default {
  async fetch(request, env) {
    let host;
    try {
      host = new URL(request.url).hostname;
    } catch {
      return new Response("bad url", { status: 400 });
    }
    if (!ALLOWED.test(host)) return new Response("host not allowed", { status: 403 });

    /* One object, always the same one: its name fixes it, and the hint is where
       it is made the first time. */
    const id = env.RELAY.idFromName(`relay-${REGION}`);
    return env.RELAY.get(id, { locationHint: REGION }).fetch(request);
  },
};

/* The object itself: one fetch, made from where it lives. */
export class Relay {
  async fetch(request) {
    const url = new URL(request.url);
    if (!ALLOWED.test(url.hostname)) return new Response("host not allowed", { status: 403 });
    return fetch(request);
  }
}
