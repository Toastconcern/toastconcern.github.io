/* Mint an FRL (Meta-account) profile token the way the Meta Horizon app does — the
 * native-SSO → blob → xfr_create_profile_token flow — driven by the site's own token.
 *
 * Runs server-side because the auth.meta.com steps need a cookie jar across calls, which
 * the browser can't maintain cross-origin. Call it with the token the site already holds:
 *     GET /frl?token=<oc_www_at>     (the token is used as the SSO approval credential)
 * Returns { step:"done", frl_token } on success, or { step, error } at whatever step fails,
 * so we can see exactly which call needs a different token/cookie.
 *
 * Values recovered from the companion app (com.oculus.twilight): the logged-out client
 * token, the create-profile doc_id and the app_id.
 */
const CLIENT_TOKEN = "FRL|512466987071624|01d4a1f7fd0682aea7ee8ae987704d63";
const NATIVE_APP_ID = "512466987071624";
const PROFILE_APP_ID = 1582076955407037;
const CREATE_PROFILE_DOC_ID = "5787825127910775";

const form = (o) => new URLSearchParams(o).toString();

/* Pull a token out of the native_sso/confirm HTML: ["LSD",[],{"token":"…"}] etc. */
function scrapeToken(html, term) {
  const m = html.match(new RegExp('"' + term + '"\\s*,\\s*\\[\\]\\s*,\\s*\\{"token":"([^"]+)"'))
         || html.match(new RegExp('"' + term + '"[\\s\\S]{0,40}?"token":"([^"]+)"'));
  return m ? m[1] : null;
}

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const kabob = url.searchParams.get("token") || "";

  /* Minimal cookie jar: collect Set-Cookie, replay as Cookie. Seed it with the user's
     meta.com session cookies (c_user, xs, datr, …) passed in via ?cookie= or a Cookie
     header — that's what authorizes the native-SSO approval. */
  const jar = {};
  const seed = url.searchParams.get("cookie") || request.headers.get("x-meta-cookie") || "";
  for (const part of seed.split(";")) {
    const kv = part.trim(); const i = kv.indexOf("=");
    if (i > 0) jar[kv.slice(0, i).trim()] = kv.slice(i + 1);
  }
  const stash = (res) => {
    const list = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const c of list) {
      const kv = c.split(";")[0], i = kv.indexOf("=");
      if (i > 0) jar[kv.slice(0, i).trim()] = kv.slice(i + 1);
    }
  };
  const cookie = () => Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ");
  const done = (step, data) =>
    new Response(JSON.stringify({ step, ...data }, null, 2), {
      status: data && data.error ? 502 : 200,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
    });

  try {
    // 1 — get the native SSO request tokens (client token only)
    let r = await fetch("https://meta.graph.meta.com/webview_tokens_query", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form({ access_token: CLIENT_TOKEN }),
    });
    stash(r);
    let j = await r.json().catch(() => ({}));
    const etoken = j.native_sso_etoken, reqtoken = j.native_sso_token;
    if (!etoken) return done("webview_tokens_query", { error: j });

    // 2 — load the confirm page; scrape the web CSRF tokens
    const confirmUrl = "https://auth.meta.com/native_sso/confirm?" +
      form({ native_app_id: NATIVE_APP_ID, native_sso_etoken: etoken, utm_source: "skyline_splash" });
    r = await fetch(confirmUrl, { headers: { cookie: cookie() } });
    stash(r);
    const page = await r.text();
    const lsd = scrapeToken(page, "LSD");
    const dtsg = scrapeToken(page, "DTSGInitialData");
    if (!lsd || !dtsg) return done("confirm", { error: "no lsd/dtsg (not logged in?)", lsd, dtsg, snippet: page.slice(0, 300) });

    // 3 — approve the native SSO for the user (this is where the login/credential is needed)
    r = await fetch("https://auth.meta.com/api/native_sso/approved/", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", "x-fb-lsd": lsd, referer: confirmUrl, cookie: cookie() },
      body: form({ __a: "1", fb_dtsg: dtsg, lsd, access_token: kabob, native_app_id: NATIVE_APP_ID, native_sso_etoken: etoken }),
    });
    stash(r);
    const bt = await r.text();
    let blob;
    try { blob = new URL(JSON.parse(bt.replace("for (;;);", "")).payload.uri).searchParams.get("blob"); }
    catch (e) { return done("approved", { error: "no blob", raw: bt.slice(0, 500) }); }
    if (!blob) return done("approved", { error: "no blob", raw: bt.slice(0, 500) });

    // 4 — decrypt the blob into a usable account access token
    r = await fetch("https://meta.graph.meta.com/webview_blobs_decrypt", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form({ access_token: CLIENT_TOKEN, blob, request_token: reqtoken }),
    });
    j = await r.json().catch(() => ({}));
    const first = j.access_token;
    if (!first) return done("webview_blobs_decrypt", { error: j });

    // 5 — mint the FRL profile token
    r = await fetch("https://meta.graph.meta.com/graphql", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form({ doc_id: CREATE_PROFILE_DOC_ID, variables: JSON.stringify({ app_id: PROFILE_APP_ID }), access_token: first }),
    });
    j = await r.json().catch(() => ({}));
    const tkn = j?.data?.xfr_create_profile_token?.profile_tokens?.[0]?.access_token;
    if (!tkn) return done("xfr_create_profile_token", { error: j });

    return done("done", { frl_token: tkn });
  } catch (e) {
    return done("exception", { error: String(e) });
  }
}
