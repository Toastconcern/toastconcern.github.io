# Changelog

Newest first. Every update gets an entry before it is pushed.

- **Site** entries are named by the cache-buster they ship with (`v=NNN`). The site is
  live on push, so one entry covers whatever goes out in one push.
- **App** entries are named `App X.Y (build N)`, matching `versionName` / `versionCode` in
  `android/AndroidManifest.xml`. `PUBLISH=1 ./build.sh` copies that section's bullets into
  `downloads/MetaDB.json`, and the app shows them in the update prompt as "What's new". Write
  those bullets for someone wearing the headset: short and plain, one change each, each on a
  single line (the build reads one line per bullet).

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

## App 1.1 (build 2) — 2026-10-13

- MetaDB checks for a newer version when it opens, and from Settings.
- Updates install from inside the app, with no download by hand.
- Settings shows which version you have.

## App 1.0 (build 1)

- First release: the site in a headset window, signed in with your Meta account, with the relay built in.
- Installs, updates and downgrades apps, keeps backups, and imports your own APKs.
