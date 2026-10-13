const $ = (id) => document.getElementById(id);
const VERSION = chrome.runtime.getManifest().version;
$("version").textContent = VERSION;

chrome.runtime.sendMessage({ type: "status" }, ({ signedIn } = {}) => {
  const state = $("state");
  state.className = signedIn ? "on" : "";
  state.textContent = signedIn
    ? "Logged in to Meta. Press Sign in with Meta in MetaDB's Settings."
    : "Not logged in to Meta in this browser. MetaDB opens the login when you sign in, or log in here first.";
  $("login").hidden = Boolean(signedIn);
});

/* ---------- updates ---------- */

const when = (t) => (t ? new Date(t).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : null);

/** Draw the update state: { off } | { update, checked, failed }. */
function show({ off, update, checked, failed } = {}) {
  $("update").hidden = !update;
  if (update) {
    $("updateTitle").textContent = `Version ${update.version} is out. You have ${VERSION}.`;
    $("updateList").replaceChildren(
      ...update.changes.map((c) => Object.assign(document.createElement("li"), { textContent: c }))
    );
    $("updateList").hidden = !update.changes.length;
  }
  $("checkNow").disabled = Boolean(off);
  $("updateState").textContent = off
    ? "Update checks are off."
    : failed
      ? `Could not check just now (${failed}).${checked ? ` Last checked ${when(checked)}.` : ""}`
      : update
        ? ""
        : checked
          ? `Up to date. Last checked ${when(checked)}.`
          : "Not checked yet.";
}

chrome.storage.sync.get({ updates: true }, ({ updates }) => {
  $("updates").checked = updates;
  if (!updates) return show({ off: true });
  chrome.storage.local.get(["update", "checked"], show);
});

/* Turned on, the background checks at once (it watches the switch); the answer is drawn when it lands. */
$("updates").addEventListener("change", () => {
  const on = $("updates").checked;
  chrome.storage.sync.set({ updates: on });
  if (!on) show({ off: true });
  else $("updateState").textContent = "Checking…";
});
chrome.storage.onChanged.addListener((c, area) => {
  if (area === "local" && (c.update || c.checked) && $("updates").checked) {
    chrome.storage.local.get(["update", "checked"], show);
  }
});

$("checkNow").addEventListener("click", () => {
  const b = $("checkNow");
  b.disabled = true;
  b.textContent = "Checking…";
  chrome.runtime.sendMessage({ type: "update-check" }, (r) => {
    b.disabled = false;
    b.textContent = "Check now";
    show(r ?? { failed: "no answer" });
  });
});

/* Reloads the extension from its folder, which picks up the unzipped new version. */
$("reload").addEventListener("click", () => chrome.runtime.reload());
