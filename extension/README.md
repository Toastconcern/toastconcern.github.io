# MetaDB Sign-in (browser extension)

Signs [MetaDB](https://metadb.toastconcern.dev/) in with your Meta account on a computer.

MetaDB needs two tokens, `oc_www_at` and `oc_ac_at`. Meta keeps them as cookies on its own
domains, and no other website can read those, so on the web they had to be copied out of
DevTools by hand. This extension reads the two cookies and hands them to MetaDB when MetaDB's
**Settings → Sign in with Meta** asks. If you are not logged in to Meta in the browser, it
opens Meta's login in a new tab, and passes the tokens on as soon as the login sets them.

What it does and does not do:

- It reads only `oc_www_at` and `oc_ac_at`, on `oculus.com` and `meta.com`.
- It hands them to MetaDB's own pages only (`metadb.toastconcern.dev`, and `localhost` for
  development). The tokens go from your browser to that tab, and nowhere else.
- It never sees your password: you log in on Meta's own page.

## Store pages that do not load

meta.com answers "This page isn't available" for some apps the store still has: system apps
such as Horizon Worlds and Meta Quest TV, and others its web store does not list. The Meta
Horizon phone app shows the same apps fine.

On such a page the extension shows the app itself, in meta.com's own app-page layout: the
store's header and menu, the trailer and screenshots with the price card beside them, then
About and Additional details. It reads the app with the phone app's own product-page query,
trying each headset's store until one answers.

- You need to be logged in to Meta: the store refuses that query to a signed-out request.
- The request goes to Meta's own API (`graph.oculus.com`), signed in with the same
  `oc_www_at` meta.com uses. Nothing goes anywhere else.
- Pages that load normally are left alone, and nothing is asked of the store for them.

## Add it (Chrome or Edge)

1. Download `MetaDB-extension.zip` from MetaDB's **Get the app** screen and unzip it.
2. Open `chrome://extensions` (or `edge://extensions`) and turn on **Developer mode**.
3. Press **Load unpacked** and choose the unzipped folder.

## Files

- `manifest.json`: permissions: cookies on Meta's domains, a content script on MetaDB, and
  one on meta.com.
- `background.js`: reads the cookies, opens the login when needed, answers the asking tab,
  runs the update check, and reads an app from the store for `store.js`.
- `content.js`: the go-between on MetaDB's pages (`window.postMessage`, own origin only).
- `store.js`: on meta.com, notices an app page that did not load and shows the app in its place.
- `popup.html` / `popup.js`: the toolbar button. It shows whether you are logged in to Meta,
  any update, and the update-check switch.

## Updates

An unpacked extension is never updated by the browser, so this one checks for itself. When
the browser starts, and every six hours after, it reads
`https://metadb.toastconcern.dev/downloads/MetaDB-extension.json`. That one request carries
nothing but the address. When the version there is newer, the toolbar button gets a badge,
its menu lists what changed with a download link, and MetaDB's Settings mentions it.

To update, unzip the new download over the extension's folder and press **Reload** in the menu.
**Check for updates** in the menu turns the checking off and on, and **Check now** asks straight
away.

## Releasing

Bump `version` in `manifest.json`, add a `## Extension X.Y` entry to `../CHANGELOG.md`, then
from the repo root:

```
node tools/extension-release.mjs
```

That writes `downloads/MetaDB-extension.json` (version and changes, for the update check) and
re-zips `downloads/MetaDB-extension.zip`. It refuses when the changelog section is missing.
