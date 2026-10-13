/* MetaDB Sign-in: the one part that can read Meta's cookies.

   oc_www_at and oc_ac_at are cookies on Meta's own domains, which no web page
   but Meta's can read. This worker reads them, and only ever hands them to a
   MetaDB tab that asked (content.js runs on MetaDB's pages and nowhere else).
   Nothing is sent anywhere: the tokens go from the browser's cookie jar to the
   MetaDB tab, which keeps them in its own settings, as if they were pasted. */

const LOGIN = "https://secure.oculus.com/my/profile/";

async function readTokens() {
  const find = async (name) => {
    const all = await chrome.cookies.getAll({ name });
    /* The newest wins, wherever Meta set it (oculus.com or meta.com). */
    all.sort((a, b) => (b.expirationDate ?? 0) - (a.expirationDate ?? 0));
    return all.find((c) => c.value)?.value ?? null;
  };
  return { token: await find("oc_www_at"), acToken: await find("oc_ac_at") };
}

/* A sign-in waiting on Meta's login: the MetaDB tab to answer, and the login
   tab opened for it. Kept in session storage, as the worker may sleep while
   the login is typed. */
async function pending() {
  return (await chrome.storage.session.get("pending")).pending ?? null;
}

async function deliver(p, tokens) {
  await chrome.storage.session.remove("pending");
  try {
    await chrome.tabs.sendMessage(p.tab, { type: "tokens", ...tokens });
    await chrome.tabs.update(p.tab, { active: true });
  } catch {}
  if (p.login) chrome.tabs.remove(p.login).catch(() => {});
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg?.type === "status") {
    readTokens().then((t) => reply({ signedIn: Boolean(t.token && t.acToken) }));
    return true;
  }
  if (msg?.type !== "sign-in" || !sender.tab) return;
  (async () => {
    const tokens = await readTokens();
    if (tokens.token && tokens.acToken) return reply({ type: "tokens", ...tokens });
    /* Not logged in to Meta in this browser: open the login, and answer once it is done. */
    const login = await chrome.tabs.create({ url: LOGIN, index: sender.tab.index + 1 });
    await chrome.storage.session.set({ pending: { tab: sender.tab.id, login: login.id } });
    reply({ type: "login" });
  })();
  return true;
});

/* Meta's login sets the cookies; the moment both are there, the waiting tab gets them. */
chrome.cookies.onChanged.addListener(async ({ cookie, removed }) => {
  if (removed || !["oc_www_at", "oc_ac_at"].includes(cookie.name)) return;
  const p = await pending();
  if (!p) return;
  const tokens = await readTokens();
  if (tokens.token && tokens.acToken) deliver(p, tokens);
});

/* The login tab closed by hand: the MetaDB tab stops waiting. */
chrome.tabs.onRemoved.addListener(async (id) => {
  const p = await pending();
  if (!p || p.login !== id) return;
  await chrome.storage.session.remove("pending");
  chrome.tabs.sendMessage(p.tab, { type: "cancelled" }).catch(() => {});
});

/* ---------- update check ----------
   Added by hand (Load unpacked), the extension is never updated by the browser,
   so it looks for itself: the site publishes the newest version beside the zip,
   in downloads/MetaDB-extension.json. Asked when the browser starts and every
   six hours, only while "Check for updates" is on (the popup's switch). A newer
   one puts a badge on the toolbar button; the popup says what changed and how to
   put it in, and MetaDB's Settings mentions it too. That one request to the site
   is the only thing the check sends, and it carries nothing but the address. */
const UPDATE_URL = "https://metadb.toastconcern.dev/downloads/MetaDB-extension.json";

/** "1.10" > "1.9": compared number by number. */
function newer(a, b) {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  }
  return false;
}

async function showBadge(update) {
  await chrome.action.setBadgeText({ text: update ? "1" : "" });
  if (update) await chrome.action.setBadgeBackgroundColor({ color: "#2f6fe0" });
  await chrome.action.setTitle({ title: update ? `MetaDB Sign-in — ${update.version} is out` : "MetaDB Sign-in" });
}

/** Resolves to { update, checked, failed }; update is null when this is the newest. */
async function checkUpdate() {
  const { updates } = await chrome.storage.sync.get({ updates: true });
  if (!updates) {
    await chrome.storage.local.remove(["update", "checked"]);
    await showBadge(null);
    return { off: true };
  }
  try {
    const res = await fetch(UPDATE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`the site answered ${res.status}`);
    if (!/json/.test(res.headers.get("content-type") ?? "")) throw new Error("the site has no version file");
    const info = await res.json();
    const update = newer(info.version, chrome.runtime.getManifest().version)
      ? { version: String(info.version), changes: Array.isArray(info.changes) ? info.changes.map(String) : [] }
      : null;
    const checked = Date.now();
    await chrome.storage.local.set({ update, checked });
    await showBadge(update);
    return { update, checked };
  } catch (err) {
    return { failed: err.message, ...(await chrome.storage.local.get(["update", "checked"])) };
  }
}

function schedule() {
  chrome.alarms.create("update-check", { delayInMinutes: 1, periodInMinutes: 360 });
}

chrome.runtime.onInstalled.addListener(() => {
  schedule();
  checkUpdate();
});
chrome.runtime.onStartup.addListener(() => {
  schedule();
  checkUpdate();
});
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === "update-check") checkUpdate();
});
/* The switch turned on asks at once; turned off clears the badge. */
chrome.storage.onChanged.addListener((c, area) => {
  if (area === "sync" && c.updates) checkUpdate();
});
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg?.type !== "update-check" || sender.tab) return;
  checkUpdate().then(reply);
  return true;
});
