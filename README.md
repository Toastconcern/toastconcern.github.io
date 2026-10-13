# MetaDB

A browser for the Meta Quest store, live at
[metadb.toastconcern.dev](https://metadb.toastconcern.dev/).

Search for an app and open it to see every release channel and every build the store
has ever held for it — including the internal builds that never shipped. Nothing is
stored on a server: every list is fetched from Meta at the moment you ask for it.

Not affiliated with Meta.

## What's on the site

The top bar holds the search box, which works from any screen, and three menus plus
**Get the app** and **Settings**: **Apps** (Apps and games, Default apps, Horizon+, Worlds,
Organizations), **User** (Headsets, Entitlements, Purchases, Avatar) and **Device** (ADB,
CompanionServer). No screen fetches anything until you press its button.

| Screen | What it does |
|---|---|
| Apps → Apps and games | Store search, from the box in the top bar. Takes an app name, an app ID, a `meta.com` store link or an Android package name, and works out which it is. |
| User → Entitlements | Everything your account owns — Quest, PC, or what it used to own (expired trials and subscriptions): each has its own Get button. Shows last played, state, where it came from, and how much DLC you own in each once DLC has been fetched. |
| User → Purchases | This account's order history — apps, DLC and in-app purchases — with what was paid, the date, and the order and refund status. Filter by name, and load more a page at a time. The payment method (card or Meta credit) is masked until you press **Show payment**. |
| User → Headsets | The headsets registered to your account and the ones shared with you. Each shows whether it is on the Public Test Channel (PTC) and can be opted in or out. Get devices also says when the account was last active in VR. |
| Apps → Default apps | What Meta pre-installs on a headset — pick the headset and the install trigger (`AUTO_UPDATER`, `NUX_BLOCKING` or `NUX_NON_BLOCKING`). |
| Apps → Horizon+ | The games the Horizon+ subscription offers right now — this month's games to claim and the rotating catalog — and how many of them are on your account. |
| Apps → Organizations | Every app a developer organization has published, from its organization ID. |
| User → Avatar | Your avatar's style, the features it is allowed to use, and every setting saved on it, from the same queries the Horizon Worlds desktop editor runs. Filter the settings by name. |
| Get the app | The headset app (MetaDB for Quest) and the sign-in extension: downloads and the steps to add each. See below. |
| Apps → Worlds | Horizon worlds, in four tabs like an opened app's: **Top worlds** (the top, trending and genre lists the Horizon app shows), **Creator** (everything one creator has published — find them by username), **Look up** (any world by its ID or a horizon.meta.com link) and **Saved** (the worlds your account has saved). Shows each world's lifetime visits, players online now and likes. Open one for its world and destination IDs, when you last visited, the app it opens in, its launch link, and its pictures. |
| Device → ADB | Lists what is installed on a connected headset next to the store's latest build, and installs an older build over it. Needs `node tools/adb-bridge.mjs` running. |
| Device → CompanionServer | Talks to the headset's own CompanionServer over Web Bluetooth — the service the Meta phone app uses. Chrome or Edge only. |

The address is always a link to what is on screen, so it can be shared and a reload comes
back to the same place: `/search/beat%20saber` for a search, `/apps/<id>/builds` for an app
open on its Builds tab, `/worlds/<id>`, `/orgs/<id>`, and `/settings`, `/mine` and so on for
the rest. Back and Forward step between screens. Screens that show your own account link to
the screen alone, since what they list belongs to whoever is signed in.

A short guided tour runs the first time the site is opened, and again from **Take the
tour** in the footer. A box that downloads one build straight from its binary ID can be
switched on in Settings (*Show download by binary ID*); it is off by default.

### An opened app

Every app, whichever list it is in, opens to six tabs. Under the tabs on Store and Builds
sit the app's buttons: **Check this app**, **Get entitlement** (free apps only, and
not on Entitlements) and **Open in store** — plus **Latest Binary Info** on Builds alone.

- **Store** — what the store says about it: category, genres, rating, the modes and
  hardware it supports, publisher, install size, all filled in by Check this app.
- **Builds** — its release channels and full build history, filled in by Check this app.
  **Check shown** on Apps and games does that for every row on screen, six at a time.
  **Release notes** lists the per-version changelog text where the store has it.
- **Reviews** — the store's own star rating, the 1–5 breakdown and the written reviews,
  sortable by most relevant or most recent, fetched when you press **Get reviews**.
- **Add-ons** — the DLC and in-app purchases this app sells, each with its price (and sale
  strikethrough) and whether you already own it, fetched with **Get add-ons** and paged.
- **Achievements** — the app's achievements with art and descriptions, and how far your
  account has got in each (earned count, per-achievement progress, secret ones hidden until
  unlocked), fetched with **Get achievements**.
- **Entitlement** — your account's side of it. Whether you own it is read when the tab
  opens; the rest each wait for their own button: **Get release channels** (the channel your
  account is on, and every channel it can see), **Get DLC** (the DLC and in-app purchases you
  own in it), **Get playtime** (time in it over the last 28 days, per headset) and **Get cloud
  backups** (every backup of it, with headset, type, size and date). DLC, playtime and backups
  are each one fetch for the whole account, so once one is in, every app shows it. Nothing
  here restores or deletes a backup. Settings has a switch for each of those three —
  *Load all your DLC / playtime / cloud backups on start*, all off by default — that fetches
  it as soon as the page opens instead.

Every build in a build history has a **Details** button that opens that exact build's
record under its row — download size, space needed, OBB size, target SDK, tracking, hashes
and permissions — where Latest Binary Info only ever describes the latest build.

In a build history, builds that reached a channel get a blue **Download** button, and the
OBB beside it when there is one. Builds that never reached a channel are dimmed; turn on
*Offer downloads for builds with no channel* in Settings to get a red Download on those
too — red because the store will usually refuse them. Meta checks entitlement on every
download, so this is not a way around owning an app.

## Getting started

The site needs two tokens from your Meta login: the **Access token** (`oc_www_at`), used
for every query, and the **Account token** (`oc_ac_at`), used for downloads. Without them a
built-in public token is used, which reads public LIVE builds and nothing else. Search,
entitlements and organizations all need your own.

There are three ways to get them:

- **Sign-in extension (Chrome, Edge, Brave).** Add the MetaDB Sign-in extension (below),
  then press **Sign in with Meta** in Settings. It fills in both tokens from your Meta login,
  and opens Meta's login in a new tab if you are not logged in yet.
- **The headset app.** It signs in through Meta's own login page and fills them in itself.
- **By hand.** Sign in at [secure.oculus.com](https://secure.oculus.com/), open developer
  tools, copy both cookies from **Application → Storage → Cookies**, and paste them into
  Settings.

Both tokens sign in as you. They are kept in this browser's `localStorage` and are sent
nowhere but to Meta, through the relay. Treat them like passwords.

## MetaDB for Quest (the headset app)

`android/` is MetaDB as an Android app for the headset: the site in a resizable window,
with the relay built in and Meta's login for sign-in. It opens on **Downgrade**, a layout
made for the headset:

- every installed app, from the store and from unknown sources, with every build the store
  has of each one. **Install**, **Update** or **Downgrade** any of them, and the build on the
  headset is marked in green;
- **Back up** the version you are on, and keep a copy of anything it downloads, so going
  back needs no download (**Backups**, with **+ Add APK** for your own APKs);
- **Uninstall**, a queue for installs, and a **History** of what was done;
- a check for newer versions of the app, with what changed in each.

**Full site** switches to the normal layout. Get it from the site's **Get the app** screen:
download `MetaDB.apk` in the Quest Browser and open it with the Package installer, or
install it from a PC over ADB or with `adb install -r MetaDB.apk`. The headset needs
developer mode. Build it with `android/build.sh`; see `android/README.md`.

## MetaDB Sign-in (the browser extension)

`extension/` is a Chrome/Edge/Brave extension (Manifest V3) that signs the site in on a
computer. It reads the two Meta login cookies and hands them to MetaDB's own pages when
Settings asks, and nowhere else. It checks for newer versions of itself (switchable in its
menu). It is not in the extension stores, so add it by hand: unzip
`downloads/MetaDB-extension.zip`, open `chrome://extensions`, turn on **Developer mode**,
and press **Load unpacked**. See `extension/README.md`.

## Why a relay is needed

`graph.oculus.com` answers every request with

```
Access-Control-Allow-Origin: https://facebook.com
```

so a browser on any other address sends the request and is then refused the reply. No
token changes that — it depends on the page's origin. It's also why the same request
works in curl or Postman, which aren't browsers.

A relay fetches the URL server-side and hands it back with permissive CORS headers. The
page tries these in order:

- **Built in.** `functions/api.js` is a Cloudflare Pages Function served at `/api` on the
  site's own origin. On Cloudflare Pages it just works and nothing needs setting up.
- **In the headset app.** It runs its own relay, so the app needs none.
- **A relay URL in Settings.** Needed on a static-only host such as GitHub Pages. Put
  `{url}` where the encoded target goes, e.g. `https://your-worker.workers.dev/?url={url}`.
  It must be `https` on a deployed site.

Every request goes out as the headset's own app manager (OCMS) sends it: its `User-Agent`,
carrying the current OCMS version, the OS build header, and `Accept-Language: en-US`. That
is the other reason downloads go through the relay: a browser won't let a page set
`User-Agent`.

### Prices

Meta prices an app in the currency of wherever the request comes from, and nothing in the
request changes that. A Pages Function runs wherever Cloudflare serves the site, often
Europe on the free plan, so prices came back in euros. `workers/relay-us` fixes that: it is
a separate Worker holding a Durable Object pinned to North America, and the built-in relay
sends store queries through it (the `US_RELAY` binding), so prices default to US dollars.
Downloads stay direct. Replies say which way they went in `X-MetaDB-Relay` (`us` or
`direct`). Deploy steps are in `workers/relay-us/README.md`. A relay on your own machine,
or the headset app, prices in your own country's currency.

Whoever runs a relay sees every URL through it, tokens included. Use your own. Both
relays in this repo only forward `*.oculus.com` hosts, so neither is an open proxy.

## Running it locally

There is no build step and no dependencies. It won't run from `file://` (ES modules and
`fetch` need a real origin), so serve it:

```
node tools/serve.mjs            # the site, at http://localhost:8791/
node tools/relay.mjs            # CORS relay on 127.0.0.1:8788
node tools/adb-bridge.mjs       # only for the ADB screen, on 127.0.0.1:8789
```

`tools/serve.mjs` serves `index.html` for any path that is not a file, as the live host
does, so links like `/apps/<id>` open. `python -m http.server` 404s them.

Then in Settings, open *Relay URL → What this is* and press **use the local relay**.

## Files

```
index.html               every screen, and the Settings form
css/style.css            all styling and the theme palettes
js/app.js                screens, rendering, filtering, settings
js/check.js              the only file that talks to Meta's servers
js/adb.js                client for tools/adb-bridge.mjs
js/companion.js          CompanionServer over Web Bluetooth
js/vendor/               fflate, for unpacking Rift builds
data/companion*.proto    the CompanionServer protocol, two versions
data/spatial-icons.json  layered home-screen tile art for Meta's own system apps
functions/api.js         the built-in relay (Cloudflare Pages)
workers/relay-us/        the US relay the built-in one sends store queries through
tools/serve.mjs          local dev server
tools/relay.mjs          the relay, for local development
tools/adb-bridge.mjs     HTTP front end for your own adb
tools/extension-release.mjs  publishes the extension (zip + version file)
android/                 MetaDB for Quest, the headset app
extension/               MetaDB Sign-in, the browser extension
downloads/               the published app and extension, with their version files
img/                     headset pictures for Your headsets
CHANGELOG.md             every update to the site, the app and the extension
```

## How it works

Every store request is a persisted GraphQL query against `graph.oculus.com/graphql`,
called by `doc_id` (or `client_doc_id` for account-only queries). `js/check.js` has one
function per query, and nothing else in the site fetches from Meta.

The build history comes from a single query that returns every binary ever uploaded for
an app, each naming the channels it was published to. The channel list is derived from
that same reply: walking newest first, the first build seen on a channel is that
channel's current build. Anything newer than every channel is what the **Dev build**
column reports.

That query is heavy — a long-lived app returns thousands of builds and hundreds of
kilobytes — and it takes one app per call. Results are cached for the session, so
reopening an app costs nothing.

## License

Copyright (c) 2026 ToastConcern.

Licensed under the [GNU AGPL-3.0](LICENSE). Use, modify and share it freely —
but any copy, modified version, or **hosted deployment** must stay open under
the same license, keep this copyright notice, and make its complete source
available to users.
