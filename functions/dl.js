/* Cloudflare Pages Function — downloads, at /dl?url=…
 *
 * The same relay as /api (functions/api.js), on a path of its own so the host can
 * rate-limit store queries on /api without touching downloads: a Rift build alone is
 * thousands of segment fetches back to back. Only the download CDN is forwarded
 * here, so /dl cannot be used to get round a limit on /api.
 */
import { onRequest as relay } from "./api.js";

const DOWNLOAD_HOST = /^securecdn(-[a-z0-9-]+)?\.oculus\.com$/;

export async function onRequest(context) {
  let host = "";
  try {
    host = new URL(new URL(context.request.url).searchParams.get("url") ?? "").hostname;
  } catch {}
  if (!DOWNLOAD_HOST.test(host)) {
    return new Response(JSON.stringify({ error: { message: "/dl only relays downloads" } }), {
      status: 403,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-MetaDB-Relay": "refused" },
    });
  }
  return relay(context);
}
