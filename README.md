# MetaDB

A browser for the Meta Quest store, live at
[metadb.toastconcern.dev](https://metadb.toastconcern.dev/).

Search for an app and open it to see every release channel and every build the store
has ever held for it — including the internal builds that never shipped. Nothing is
stored on a server: every list is fetched from Meta at the moment you ask for it.

Not affiliated with Meta.

## What's on the site

The top bar has two menus and Settings. No screen fetches anything until you press its
button.

**Apps**

| Screen | What it lists |
|---|---|
| Apps and games | Store search. Takes an app name, an app ID, a `meta.com` store link or an Android package name, and works out which it is. |
| Default apps | What Meta pre-installs on a headset — pick the headset and the install trigger (`AUTO_UPDATER`, `NUX_BLOCKING` or `NUX_NON_BLOCKING`). |
| Entitlements | Everything your account owns, Quest or PC, with last played, state and where it came from. |
| Organizations | Every app a developer organization has published, from its organization ID. |

A short guided tour runs the first time the site is opened, and again from **Take the
tour** in the footer. A box that downloads one build straight from its binary ID can be
switched on in Settings (*Show download by binary ID*); it is off by default.

Every row opens the same way. **Check this app** pulls the release channels, the full
build history, the store listing and any OBB expansion files in one go. **Check shown**
does that for every row on screen, six at a time.

In a build history, builds that reached a channel get a blue **Download** button, and the
OBB beside it when there is one. Builds that never reached a channel are dimmed; turn on
*Offer downloads for builds with no channel* in Settings to get a red Download on those
too — red because the store will usually refuse them. Meta checks entitlement on every
download, so this is not a way around owning an app.

**Devices**

| Screen | What it does |
|---|---|
| Your headsets | The headsets registered to your account and the ones shared with you. Each can be opted in or out of the Public Test Channel (PTC). |
| ADB | Lists what is installed on a connected headset next to the store's latest build, and installs an older build over it. Needs `node tools/adb-bridge.mjs` running. |
| CompanionServer | Talks to the headset's own CompanionServer over Web Bluetooth — the service the Meta phone app uses. Chrome or Edge only. |

## Getting started

1. Open **Settings**.
2. Paste your **Access token** (`oc_www_at`). Sign in at
   [secure.oculus.com](https://secure.oculus.com/), open developer tools, and copy the
   cookie from **Application → Storage → Cookies**. Without one, a built-in public token
   is used, which reads public LIVE builds and nothing else — search, entitlements and
   organizations all need your own.
3. For downloads, also paste your **Account token** (`oc_ac_at`), from the same place.
4. If a red notice at the top says the page has no relay, set one (see below).

Both tokens sign in as you. They are kept in this browser's `localStorage` and are sent
nowhere but to Meta, through the relay. Treat them like passwords.

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
- **A relay URL in Settings.** Needed on a static-only host such as GitHub Pages. Put
  `{url}` where the encoded target goes, e.g. `https://your-worker.workers.dev/?url={url}`.
  It must be `https` on a deployed site.

Downloads also go through the relay, because the CDN wants the Quest companion app's
`User-Agent` and a browser won't let a page set that header.

Whoever runs a relay sees every URL through it, tokens included. Use your own. Both
relays in this repo only forward `*.oculus.com` hosts, so neither is an open proxy.

## Running it locally

There is no build step and no dependencies. It won't run from `file://` (ES modules and
`fetch` need a real origin), so serve it:

```
python -m http.server 8791      # the site, at http://localhost:8791/
node tools/relay.mjs            # CORS relay on 127.0.0.1:8788
node tools/adb-bridge.mjs       # only for the ADB screen, on 127.0.0.1:8789
```

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
tools/relay.mjs          the relay, for local development
tools/adb-bridge.mjs     HTTP front end for your own adb
img/                     headset pictures for Your headsets
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
