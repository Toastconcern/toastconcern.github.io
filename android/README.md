# MetaDB for Quest

The MetaDB site as an app on the headset. It opens on **Downgrade**: every app installed
on the headset on the left, and for a store app every build it has had on the right, each
with **Update**, **Downgrade** or *On headset*. Going back to an older build uninstalls the
app first (its saved data goes with it), and that is asked about before anything happens.
Sideloaded apps are listed under *Unknown sources*.

Downgrade has three tabs:

- **Apps** — the list and the builds. The build on the headset has a green edge. **Save**
  keeps a build without installing it; **Back up** on the installed build keeps a copy of
  the version you are on, expansion file and all; **Uninstall** removes the app (asked
  first). **Show apps not installed** adds every Quest app you own that is not on the
  headset, to install or save. Sideloaded apps under *Unknown sources* open too: back one
  up, put a kept copy back, or uninstall it.
- **Backups** — laid out like Apps: every app you have copies of on the left, its kept
  versions on the right. That is everything installed or saved through the app, every
  backup, and any APK of your own added with **+ Add APK** — its package, name, version,
  build and icon are read out of the APK. Installing from here needs no download, and
  works signed out. Kept in `Android/data/dev.toastconcern.metadb/files/backups`, so they
  go if MetaDB is uninstalled.
- **History** — what was installed, updated, downgraded, saved, backed up or deleted, and
  from which version to which.

Installs, saves and backups run one at a time. Pressing another while one runs queues it
(the button says *Queued (2nd)*); pressing a queued one again takes it out of the queue.
Confirmations and results use the app's own dialog and notices. **Sign out** (top bar, or
Settings) removes the tokens from the headset and clears Meta's login in the app.

**Full site** switches to the whole MetaDB site; **Downgrade** in its menu switches back.
The app remembers which you were on.

Underneath it is the same site — `metadb.toastconcern.dev` in a full-screen window — with
the things a browser cannot do built in:

- **The relay.** The store only lets facebook.com read its replies, so the site normally
  needs a relay. The app runs one on `127.0.0.1:8788` and points the site at it. There is
  nothing to set up.
- **Sign in with Meta.** In Settings, *Sign in with Meta* opens Meta's own login in the
  app. Once you are signed in, the app reads your two tokens (`oc_www_at` and `oc_ac_at`)
  from that login and saves them in Settings. They stay on the headset; nothing is sent
  anywhere but Meta.
- **Installing.** A build is downloaded and handed to Android's installer, and a game's
  expansion file is put in `Android/obb/<package>/`. Android still shows its own
  install and uninstall prompts, and asks once for MetaDB to be allowed to install apps
  (and, for a game with an expansion file, to manage files).

Inside the app the site hides what does not apply there: the relay settings, the steps for
copying tokens by hand, and the Device screens (ADB needs a PC, CompanionServer needs
Bluetooth). Reset in Settings also signs you out of Meta in the app.

## Install

The site's **Get the app** screen (`metadb.toastconcern.dev/#getapp`) has both ways. The
headset needs developer mode either way.

- **On the headset:** open that screen in the Quest Browser and press **Download
  MetaDB.apk**. Then in the **Files** app, go to your downloads, press the **⋯** menu on
  MetaDB.apk, choose **Open with → Package installer**, and Install.
- **From a PC:** connect the headset on the site's ADB screen and press **Install over
  ADB** on Get the app — or download the APK and run `adb install -r MetaDB.apk`, or drop
  it into SideQuest.

It shows up under **Library → Unknown sources**.

## Build

No Gradle. You need a JDK and the Android SDK (one platform and build-tools):

```sh
./build.sh              # build/MetaDB.apk
DEBUG=1 ./build.sh      # debuggable, so Chrome DevTools (chrome://inspect) can attach
SITE=http://127.0.0.1:8791/index.html ./build.sh   # test a local copy of the site (adb reverse tcp:8791 tcp:8791)
```

`PUBLISH=1 ./build.sh` builds the release and copies it to `../downloads/MetaDB.apk` (with
`MetaDB.json`, its version and size), which is what Get the app serves. It refuses a
`DEBUG` or `SITE` build. Bump `android:versionCode` in the manifest before publishing an
update, or a headset that has it already will not take it as one.

The first build makes a signing key, `metadb.keystore`, beside the script. Keep it: an
update has to be signed with the same key as the copy already installed. It is not
committed.

## Files

- `src/.../MainActivity.java` — the window, sign-in, downloads.
- `src/.../Installer.java` — install, update and downgrade, and expansion files.
- `src/.../Relay.java` — the relay; the same as `tools/relay.mjs`. Runs on a desktop JVM
  too, for testing.
- `AndroidManifest.xml`, `res/` — the window size, the icon, and plain HTTP allowed to
  `127.0.0.1` only.

The site detects the app by the `MetaDBApp` object it adds to the page (`signIn()`,
`signOut()`, `relay()`, `install()`, `installedApps()`, `installedVersion()`).
