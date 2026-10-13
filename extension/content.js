/* Runs on MetaDB's pages only. A go-between: the page asks with
   window.postMessage, this passes the question to the extension, and the
   answer goes back to the page the same way — to this page's own origin only. */

const say = (data) => window.postMessage({ metadbExt: true, ...data }, location.origin);

window.addEventListener("message", (e) => {
  if (e.source !== window || e.origin !== location.origin || !e.data?.metadbPage) return;
  if (e.data.type === "hello") announce();
  if (e.data.type === "sign-in") {
    chrome.runtime.sendMessage({ type: "sign-in" }, (answer) => {
      if (chrome.runtime.lastError) return say({ type: "error", message: chrome.runtime.lastError.message });
      say(answer);
    });
  }
});

/* Tokens that arrive later — after a login in another tab — or a login given up on. */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "tokens" || msg?.type === "cancelled") say(msg);
});

/* "Here", with this version and — when "Check for updates" is on and found one —
   the newer version, so MetaDB's Settings can mention it. */
function announce() {
  chrome.storage.sync.get({ updates: true }, ({ updates }) => {
    chrome.storage.local.get("update", ({ update }) => {
      say({ type: "here", version: chrome.runtime.getManifest().version, update: updates ? (update ?? null) : null });
    });
  });
}

/* Announced as well as asked, so a page that loaded first still finds out. */
announce();
