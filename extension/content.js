/* Runs on MetaDB's pages only. A go-between: the page asks with
   window.postMessage, this passes the question to the extension, and the
   answer goes back to the page the same way — to this page's own origin only. */

/* Firefox's promise-based API is `browser` (its `chrome.*` is callback-only);
   Chrome's `chrome.*` is promise-based in MV3. Use `browser` where it exists so
   the promise calls below work in both. In Chrome `browser` is undefined (no-op). */
if (typeof browser !== "undefined") globalThis.chrome = browser;

const say = (data) => window.postMessage({ metadbExt: true, ...data }, location.origin);

window.addEventListener("message", (e) => {
  if (e.source !== window || e.origin !== location.origin || !e.data?.metadbPage) return;
  if (e.data.type === "hello") announce();
  if (e.data.type === "sign-in") {
    chrome.runtime
      .sendMessage({ type: "sign-in" })
      .then(say, (err) => say({ type: "error", message: err.message }));
  }
  if (e.data.type === "frl-token") {
    chrome.runtime
      .sendMessage({ type: "frl-token", token: e.data.token })
      .then(say, (err) => say({ type: "error", message: err.message }));
  }
});

/* Tokens that arrive later — after a login in another tab — or a login given up on. */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "tokens" || msg?.type === "cancelled") say(msg);
});

/* "Here", with this version and — when "Check for updates" is on and found one —
   the newer version, so MetaDB's Settings can mention it. */
async function announce() {
  let updates = true, update = null;
  try {
    ({ updates } = await chrome.storage.sync.get({ updates: true }));
    ({ update } = await chrome.storage.local.get("update"));
  } catch {}
  say({ type: "here", version: chrome.runtime.getManifest().version, update: updates ? (update ?? null) : null });
}

/* Announced as well as asked, so a page that loaded first still finds out. */
announce();
