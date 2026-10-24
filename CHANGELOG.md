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

## Site v=254 — 2026-10-24

- **Watchlist rebuilt.** One row per watched app: its icon and name, the build you last saw
  (version + release date), and the **new build** (version + date, in green) once one turns
  up — an app with nothing new leaves that column blank, a check that errored shows a quiet
  **Couldn't check**. Click a row to open a drop-down with the app's channels and build
  history (the same panel the app lists expand). **Mark seen** and remove appear on hover.
- **Update notifications.** When a check finds a new build of a watched app, a small card
  slides in at the corner with the app's name and the build it jumped to, and a link to the
  Watchlist. New under Settings: turn the pop-ups on or off, and choose how long they stay
  (5s / 9s / 15s / until dismissed).
- **Settings tidied and expanded.** The form is grouped into panels that fill the width
  instead of a single narrow column. New controls: **Auto-check frequency** (how often the
  Watchlist re-checks when you open the site), the notification options above, and **Row
  spacing** (Comfortable or Compact across every list).
- **Clearer message when no relay is set.** On a host without a built-in relay, a check now
  says "set a relay URL on the Settings page" instead of a confusing "the reply was not JSON"
  error.
- **Setup guide redesigned.** The first-run chooser is now a proper dialog — a fixed header and
  an anchored footer (Save is always in reach), labelled sections with a one-line description
  each, and every option a selectable row that fills in when ticked. **Esc** now saves and
  closes it, same as Save and continue.
- **Get the app redesigned.** The install instructions are now three cards — on the headset,
  from a PC, and the browser sign-in extension — each with its steps and download, instead of
  one long column of text.
- **Watchlist "New build" column reads at a glance.** Red **Not updated since <date>** while
  an app has had nothing new, turning green with the new version + date once a build lands.
  Apps with a new build sort to the top of the list.
- **Choose which tab opens.** Settings → Lists & columns → **Open on** sets the screen the
  site lands on. (Also fixed the Watchlist nav link doing a full reload instead of switching
  in place.)
- **Test the notification.** Settings has a **Show a test notification** button that fires a
  sample pop-up.
- **Settings reorganised.** Regrouped into clearer, labelled sections — Account, Appearance,
  Watchlist & notifications, Lists & columns, Inside an app, Your data (loaded on open), and
  Developer (which now holds the relay) — each with a one-line description.

## Site v=253 — 2026-10-23

- **New setup guide (first visit, and Settings → Choose what shows).** A short wizard to pick
  what MetaDB shows you: the top-level screens, the per-app tabs (Reviews, Posts, Add-ons,
  Achievements) and the data toggles (app art, store links, binary info, developer builds, OBB
  lookups, auto library/DLC/playtime/backups). Anything you switch off is hidden from the nav
  **and never requested from the store** until you switch it back on. It shows once on a first
  visit and is re-openable any time from Settings; choices are kept in this browser.
- **New Watchlist screen (Apps → Watchlist).** Track any app for new builds: press the **+** at
  the left of its row, and it joins a list MetaDB checks when you open the site and whenever you
  press **Check now**. Apps whose live build changed since you last looked are flagged with a
  **New build** marker and a count on the nav link; **Mark seen** clears a flag once you've
  looked, and the watch control drops an app. Its rows match the main app list — bold names,
  mono build columns, the same drop-down app panel on click — and compare the live **build
  number** (not just the version name, which Meta often keeps the same across builds). The list
  is kept only in your own browser, and checks reuse the normal build lookup, so no extra store
  load beyond the apps you chose to watch.
- **Watch a build from anywhere.** A faded **+** sits in the gutter to the left of every app
  row — Apps and games, your library, store, wishlist and the rest — adds that app to your
  Watchlist (**−** to remove). It hangs outside the table, so the columns line up exactly as on
  every other screen. It shows only when the Watchlist screen is switched on, is on by default,
  and can be turned off under Settings → *Show watch buttons on app rows*. The watchlist's own
  rows carry the same control, and the old Watch button inside the app drop-down is gone now
  that the row control is everywhere.
- **Watchlist's auto-check moved into Settings** (*Check the watchlist when the site opens*),
  with the other behaviour toggles, instead of sitting on the Watchlist page.

## Site v=250 — 2026-10-22

- **The Setup tab no longer has an account sign-in step.** No web-drivable method actually signs
  the headset in: the headset's auth service rejects a plain web token (returns -7), and the
  short-lived app-scoped token the Meta app sends is minted inside Meta's app from an input
  shape that isn't recoverable from the web. Rather than show a step that can't work, sign-in is
  out of the guided flow (claim → Wi-Fi → set time → finish). The token command stays in the
  Security tab as "advanced" for anyone who already holds a real app-scoped token.

## Site v=249 — 2026-10-21

- **CompanionServer gets the full command set from the current firmware.** Thirty methods
  that shipped in CompanionServer versionCode 34 (Horizon OS v14) but were missing from the
  map are now in `data/companion.proto` and show up in the panel: media volume get/set, close
  all apps, open navigator, passthrough and pass-and-try status, Wi-Fi Easy Connect (QR / DPP),
  classic-Bluetooth auto-pairing, the first-time-setup (NUX) status and TWF setup reads, the
  prescription-lens pair/unpair/status/cancel group, backup-PIN verify, retail demo
  start/reset/status/app-filter, managed-provisioning prepare, device provisioning / state /
  registration-challenge / certificate installer, and credential import/export. Their request
  and response bodies were read from the firmware's own protobuf. The destructive or
  secret-handling ones (close all apps, credential export/import, device provision, install
  certificate) ask before they run.
- **The Setup tab walks you through it.** Setting up a new or just-reset headset is now a
  short numbered list — get it onto Wi-Fi, sign in to your account, finish first-time setup,
  and (for a factory-reset headset) claim it — each step saying in plain words what it does.
  Sign in to your account has a **Fill from my account** button that borrows the token and ID
  from the account you're signed into under Settings, so you don't hand-type them.
- **Every command now says exactly what it does, and what each box is for.** Descriptions were
  written from the headset's own decompiled CompanionServer — what the request actually does, what
  goes in each field and where to get it, and honest notes where a command is deprecated or a no-op
  in this firmware. Every button says its action (Get, Set, Pair, Check, Enable) rather than a wall
  of identical Run buttons.

## Site v=248 — 2026-10-20

- New **Store front** screen (Apps menu): the store as the Horizon phone app shows it. Pick a
  headset and press Get store for the sections the store picks for it, in its own order, with
  how the store draws each one (shelf, top chart, spotlight, sale card…). Pick a section to
  list its apps as ordinary rows: open, check and filter them like any other list, and Load
  more for the rest. Stores with more than one tab (Games, Apps…) get a tab picker.
- **Top charts** on the Store front: Get store also lists the headset's top charts, under
  their own heading in the section picker. Each lists its apps ranked, like a section.
- New **Wishlist** screen (User menu): the apps and games on your Meta wishlist, with the
  store's price for each, as ordinary rows. Needs your own token.
- New **Posts** tab on an opened app: the developer's news and update posts from the app's
  store page, with their picture and date. Fetched by its own Get posts button.
- **Rift S** (`LAGUNA`) joins the headset picker. It is one of the headset types the phone
  app asks the store about, and it has its own PC store.
- **Open in store** goes to the right meta.com page for Rift and Go apps (`pcvr/` and `go/`),
  instead of the Quest page, which never loads for them.
- Replies that send a list in instalments (a streamed list) are put back together in full;
  before, only the first instalment was kept.
- A search answered after a newer one (the box cleared, the headset changed) no longer
  replaces the newer results, and a link to a search or an app asks the store once, not twice.
- Typing in a filter box redraws only the list on show, once typing pauses, instead of
  every list on every screen at each key — the big win with a large library loaded.
- Reviews, add-ons, achievements, posts, release notes and Latest Binary Info no longer
  vanish when the row redraws while they load (a check finishing, say).
- The Entitlement tab forgets the old account's library on sign-out or a new token, and
  says when the library could not be read instead of "Not in your Quest library".
- Achievements use the signed-in account's ID after a token change, not the previous one's.
- Picking another Store front section while Load more runs no longer leaves it empty.
- Check shown on Organizations and Default apps checks only the apps on show, and a
  second press while it runs is ignored.
- The page no longer scrolls under an app reopened during the closing animation.
- A second confirm box no longer silently drops the first one's action.
- Find store ID keeps the app open, and no longer points at a file the site does not have.
- Worlds: Get details shows that it is loading, and a cleared Load more error goes away.
- Test channel messages mask the serial like the Headsets table does.
- CompanionServer: Stop mirroring is labelled as such, a late reply no longer knocks every
  later command out of step, names with `&` show as typed, the tab strip hides when
  disconnected, and an engine too old for the screen says so.
- The store's own "not found" is no longer taken for a missing built-in relay, a stalled
  request gives up after 90 seconds, and the built-in relay answers a failed upstream with
  an error rather than Cloudflare's page.
- `tools/adb-bridge.mjs` only answers this site and localhost (more with `METADB_ORIGINS`):
  before, any web page could install or push files to a connected headset.
- `tools/relay.mjs` survives a download dropped mid-transfer; `tools/serve.mjs` no longer
  serves folders beside the repo.
- A favicon (the browser asked for `/favicon.ico` and got the whole page), and check.js is
  fetched alongside app.js instead of after it.
- A lighter look: the MetaDB icon beside the name, larger screen headings and small-caps
  column heads. The button that starts each screen (Search, Get store, Get devices…) is
  filled blue, so it is the first thing you find. On a phone, tab strips (an opened app's,
  Worlds') sit on one row that scrolls sideways instead of wrapping — an app's seven tabs
  used to take three rows and run under the Expand button.
- Every screen fits the window, checked against a real account at 360–1920px wide. The
  library no longer runs 140–320px past the edge: long build names are cut shorter (the
  full name is in the tooltip and on Builds), a platform with no short name shows in words
  ("Horizon unity world") instead of an unbreakable code, and below a wide desktop it drops
  the store's build number and date. Between phone and desktop the store lists drop the
  device and dev-build columns. On a phone, Headsets and Purchases show each entry as a
  small card, Worlds hides the world ID, ADB the build numbers, and column heads may wrap.

## Extension 1.3 — 2026-10-20

- App pages that meta.com says are not available (Horizon Worlds, Meta Quest TV and others) now show the app, in the same layout as every other app page on meta.com.
- The app is read the way the Meta Horizon phone app reads it, from the store itself. You need to be logged in to Meta.
- Pages that load normally are left alone, and nothing is asked of the store for them.

## Site v=247 — 2026-10-14

- Settings → Sign in with Meta turns into **Sign out** once you are signed in, with a line
  saying so. Signing out removes both tokens from this browser (it asks first) and leaves
  your Meta login itself alone, so signing back in is one press.
- Signed in with the extension, **Refresh tokens** sits beside Sign out and reads both tokens
  again from your Meta login, opening Meta's login if it has run out. Use it when requests
  start failing or after switching Meta accounts.

## App 1.4 (build 5) — 2026-10-13

- MetaDB only updates itself from its own address, built into the app, and ignores any other.
- An update must be signed with the same key as the installed app, or it is refused before anything is installed.

## Extension 1.2 — 2026-10-13

- Update notices must be signed by the developer; anything else is ignored, even if the site were taken over.
- Download now fetches the new version itself and saves it only if it is exactly the signed file.

## Site v=245 — 2026-10-13

- Downgrade: GitHub repos list every release with an APK, not just the newest 50. It reads
  GitHub's pages 100 at a time, up to 1,000 releases. QuestAppVersionSwitcher now shows all
  156 versions.

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
- If the site fails to start because the browser kept a stale file (a deploy caught half
  rolled out, which happened to the headset app with v=244), it now fetches its files again
  and reloads by itself, once. The error message only shows if that does not fix it.

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
