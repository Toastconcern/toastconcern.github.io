# Changelog

Newest first. Every update gets an entry before it is pushed.

- **Site** entries are named by the cache-buster they ship with (`v=NNN`). The site is
  live on push, so one entry covers whatever goes out in one push.
- **Extension** entries are named `Extension X.Y`, matching `version` in
  `extension/manifest.json`. `node tools/extension-release.mjs` copies that section's bullets
  into `downloads/MetaDB-extension.json` (read by the extension's update check and shown as
  what changed), re-zips `downloads/MetaDB-extension.zip`, and refuses if the section is
  missing. Write those bullets for someone reading them in the extension's menu.
- **App** entries are named `App X.Y (build N)`, matching `versionName` / `versionCode` in
  `android/AndroidManifest.xml`. `PUBLISH=1 ./build.sh` copies that section's bullets into
  `downloads/MetaDB.json`, and the app shows them in the update prompt as "What's new". Write
  those bullets for someone wearing the headset: short and plain, one change each, each on a
  single line (the build reads one line per bullet).

## Site v=244 — 2026-10-13

- The OCMS headers (User-Agent with the OCMS version, OS build, language) live in one file,
  `data/ocms-headers.json`. The Cloudflare relay, `tools/relay.mjs` and the site all read it,
  and the site hands it to the headset app. Changing the OCMS version is now one edit, and
  installed apps (1.3+) pick it up the next time they open.
- The site checked for a newer version twice over: two separate checks, both re-reading the
  page. They are now one: 45 seconds after opening, then every 15 minutes, and when the tab
  comes back into view. It never reloads during an install in the headset app, and in
  Downgrade it asks in the app's own prompt.
- Removed code nothing used.

## Site v=243 — 2026-10-13

- Browser engines from Chrome 74 up to now all get what they need. Each CSS fallback (for
  flexbox gap, `inset`, `min()`, `color-mix()`, `:focus-visible`) now loads only where the
  engine lacks that feature, separately from which script it runs. Chrome 84–85 no longer get
  doubled spacing, and Chrome 86–110 get the colours `color-mix()` draws. Tested in Chromium
  74, 84 and 86 and a current browser.
- Old engines: the menus' arrows and the "What this is" toggles are spaced from their text
  again.

## Site v=242 — 2026-10-13

- Downgrade has its own theme picker in its top bar. It is the same setting as the site's
  picker, so changing either one changes both.

## Site v=241 — 2026-10-13

- MetaDB runs on the Quest 1. Its last system update has a 2019 browser engine (Chrome 74),
  which could not read the site's code, so the page came up half-built. Old engines now get
  their own copy of the site, made from the same code by `tools/legacy-build.mjs`, with layout
  fallbacks. Everything newer is unchanged. Tested in Chromium 74: the full site and the
  headset app's Downgrade layout.
- Old engines that cannot report a dark or light preference now default to the dark theme.
- When the site cannot start at all, it now says so at the top of the page: the browser
  engine's version, the oldest it supports (Chrome 74), and the first error.

## Site v=240 — 2026-10-13

- Downgrade: apps from unknown sources can list their versions from GitHub. Link an
  app's repo (owner/repo, or its github.com link), and every release with an APK is listed,
  with Save and Install, Update or Downgrade, the same as store builds. **+ GitHub** beside
  Unknown sources adds a repo for an app that is not installed yet. It moves to the app
  once one of its APKs is installed.
- The headset app now takes its relay headers (the OCMS version) from the site, so they
  update without a new APK (app 1.3 and later).
- Fixed: the headset app opened on the full site instead of Downgrade after a reload.

## Site v=239 — 2026-10-13

- Prices default to US dollars. Meta prices by where a request comes from, and Cloudflare
  often serves the site from Europe, which came back in euros. The built-in relay now sends
  store queries through a US relay (`workers/relay-us`, a Durable Object pinned to North
  America) once it is deployed and bound. Until then it works as before. Downloads stay
  direct.
- The Copy link button is gone from app panels. The address bar is still the link.

## Site v=238 — 2026-10-13

- Every request to Meta now goes out with the headset app manager's (OCMS) own headers:
  its User-Agent, carrying the current OCMS version (1048.0.0.115.1326), and the OS build.
  They also send `Accept-Language: en-US,en;q=0.6`, so dates and store text come back in
  US English wherever the relay runs. That applies to the built-in relay, `tools/relay.mjs`
  and the headset app's relay.
- The address is now a link to what is on screen, so it can be shared, and a reload comes
  back to the same place. It uses plain paths: `/search/beat%20saber` for a search,
  `/apps/<id>/builds` for an app on its Builds tab, `/worlds/<id>` and `/orgs/<id>`, and
  `/settings`, `/mine` and so on for the other screens. Back and Forward step between
  screens.
- Old `#settings` and `#apps` links still work, and become the new paths.

## Site v=237 — 2026-10-13

- Settings has **Sign in with Meta** on the website too. With the MetaDB Sign-in extension
  added to Chrome or Edge, it fills in both tokens from your Meta login. It opens Meta's
  login in a new tab when you are not logged in yet, and fills in once you finish.
- Get the app has the extension's download and the steps to add it.
- Settings says when a newer version of the extension is out, with its download, if the
  extension's update check is on.

## Extension 1.1 — 2026-10-13

- Checks for a newer version when the browser starts and every six hours, and puts a badge on its button when there is one.
- The button's menu says what changed, links the download, and has a Reload button for after you unzip it.
- Check for updates can be switched off in the menu, and there is a Check now button.
- MetaDB's Settings mentions a newer extension too, while update checks are on.

## Extension 1.0 — 2026-10-13

- First release: reads Meta's two login cookies and hands them to MetaDB's own pages when
  MetaDB asks, opening Meta's login if needed. The toolbar button shows whether you are
  logged in to Meta.

## Site v=236 — 2026-10-12

- A page left open notices when the site has been updated. It reloads by itself while
  MetaDB is out of view and nothing is installing; otherwise it asks, with Reload or Later.
  It checks when it opens, every ten minutes, and whenever the window comes back into view.
  In the headset app the same check also looks for a newer MetaDB.
- Store apps that search does not find, such as Meta's environments, now get their art from
  their store page, so Theatre and the like show a picture instead of a blank icon.
- Downgrade: Back up and Uninstall sit centred in the app's header instead of at its top.

## Site v=235 — 2026-10-12

- Downgrade: a store app with no store art shows its own icon from the headset instead of an
  empty square.
- An app whose art could not be found is looked up again next time MetaDB opens, rather than
  never.

## Site v=234 — 2026-10-12

- Downgrade: every installed app has Back up at its top right, beside Uninstall. That
  includes apps from unknown sources, which had it lower down.
- A store app installed from an APK now shows its store name and icon, and so does a store
  app brought in with + Add APK. Each one is looked up once and remembered.
- The app's update prompt lists what changed in the new version, read from this file.

## Site v=212–233 — 2026-10-12

These went out together; the live site was on `v=211` before them.

- Queries moved onto `client_doc_id`s where possible, so they need fewer requests. Settings
  are cached in memory.
- Related apps removed from the app panel.
- In the headset app:
  - Downgrade is the default layout, with a switch to the full site.
  - Downgrade lists installed store apps, apps from unknown sources and, optionally, owned
    apps that are not installed.
  - Each build of an app has Install, Update or Downgrade and Save, and the installed build
    is marked in green.
  - Jobs queue instead of being refused while another runs.
  - New tabs: Backups (with + Add APK) and History.
  - Its own prompts and notices, sign-in and sign-out, uninstall, and a check for a newer
    MetaDB.
- Get the app screen: install the headset app from the headset itself, or from a PC over
  ADB.

## App 1.3 (build 4) — 2026-10-13

- Install, update or go back to any GitHub release of apps from unknown sources.
- An APK from a linked repo is checked to be that app before it is kept or installed.
- The headers MetaDB sends to Meta now update with the site, without a new version of the app.
- Works on Android 10: installing games with expansion files, and listing your apps, no longer need Android 11.

## App 1.2 (build 3) — 2026-10-13

- Requests to Meta now identify as the current version of the headset's own app manager, and ask for US English.

## App 1.1 (build 2) — 2026-10-13

- MetaDB checks for a newer version when it opens, and from Settings.
- Updates install from inside the app, with no download by hand.
- Settings shows which version you have.

## App 1.0 (build 1)

- First release: the site in a headset window, signed in with your Meta account, with the relay built in.
- Installs, updates and downgrades apps, keeps backups, and imports your own APKs.
