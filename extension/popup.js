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

/* The new version is fetched from the extension's own fixed address and saved only if it
   is exactly the file the developer signed: its SHA-256 and size are part of the signed
   version file (background.js verifies that signature before an update is shown). */
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
$("download").addEventListener("click", async () => {
  const b = $("download");
  const say = (text) => ($("downloadState").textContent = text);
  b.disabled = true;
  b.textContent = "Checking the download…";
  try {
    const { update } = await chrome.storage.local.get("update");
    if (!update || !update.sha256 || !update.size || !update.url) throw new Error("Press Check now first, then try again.");
    const res = await fetch(update.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`The download answered ${res.status}.`);
    const data = await res.arrayBuffer();
    if (data.byteLength !== update.size || hex(await crypto.subtle.digest("SHA-256", data)) !== update.sha256) {
      throw new Error("The download is not the file the developer signed, so it was not saved.");
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "application/zip" }));
    a.download = `MetaDB-extension-${update.version}.zip`;
    a.click();
    say("Checked and saved. Unzip it over this extension's folder, then press Reload.");
  } catch (err) {
    say(err.message);
  } finally {
    b.disabled = false;
    b.textContent = "Download the new version";
  }
});

/* Reloads the extension from its folder, which picks up the unzipped new version. */
$("reload").addEventListener("click", () => chrome.runtime.reload());
