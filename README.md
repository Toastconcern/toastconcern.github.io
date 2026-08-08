# MetaDB

A browser for the Meta store. Search it by name, ID, store link or package name, then
open an app to pull its release channels and every build the store holds for it.

One list is kept locally: Meta's own system apps, in `data/meta-apps.json`, which are
not returned by store search.

## Files

```
index.html            markup
css/style.css         all styling
js/app.js             screens, rendering, filtering, settings UI
js/check.js           the only file that touches the network
data/meta-apps.json   apps published by Meta
tools/relay.mjs       CORS relay for local development
```

No build step, no dependencies. Serve it through any static server
(`python -m http.server`, `npx serve`, GitHub Pages). It will not work from a
`file://` URL because it uses ES modules and `fetch`.

## The Meta apps file

`data/meta-apps.json` holds one entry per app, and one entry per release channel inside it:

```json
{
  "id": "2448060205267927",
  "name": "Beat Saber",
  "platform": "ANDROID_6DOF",
  "channels": [
    {
      "name": "LIVE",
      "group": "PRIMARY",
      "version": "1.44.3_23042",
      "versionCode": 2811,
      "releasedAt": "2026-07-08"
    }
  ]
}
```

`platform` is `ANDROID_6DOF` for Quest or `PC` for Rift. Every entry was read from the
live store on 2026-08-08, so the versions and build numbers are real.

A check replaces what a row displays with what the store currently publishes, so a record
flagged as out of date shows the new version rather than the stale one it was compared
against.

### Apps with no store ID

System apps (`com.oculus.browser`, the environments, and so on) are identified by package
name and carry no `id`:

```json
{ "packageName": "com.oculus.browser", "name": "Browser", "platform": "ANDROID_6DOF", "channels": [] }
```

They show a status of `no store ID`, since a version check needs one. The expanded row has
a **Find store ID** button, and the search box on the Apps and games screen accepts a
package name directly.

Resolution uses:

```
GET https://graph.oculus.com/graphql
    ?access_token=<token>
    &client_doc_id=130289649615311830816220616253
    &variables={"package_names":["com.oculus.browser", …]}
```

It takes an **array**, though only one name goes out at a time now. And it uses
`client_doc_id`, not `doc_id` — with an app
token it answers `Unauthorized logged out query`, because it wants a token belonging to a
logged-in account. The built-in public token will not do; set your own on Settings.

The reply is parsed by walking it for any object carrying a store-shaped ID next to one of
the requested package names, rather than by a fixed path, so a change in nesting will not
break it. If the shape ever changes enough to defeat that, it says so plainly instead of
silently resolving nothing.

### Screens

The top bar switches between three screens, driven by the URL hash:

- `#apps` — **Apps and games**, a live view of the store
- `#meta` — **Meta apps**, from `data/meta-apps.json`
- `#settings` — token and relay

The Apps and games screen is driven by its search box, which takes four kinds of input and
works out which is which from the text itself:

| Input | What happens |
|---|---|
| An app name | store search |
| An app ID | fetched directly |
| A `meta.com` store link | the ID is pulled out of it, then fetched |
| An Android package name | resolved to an ID, then fetched |
| *(empty)* | clears the table — nothing is shown until you search |

Opening a row shows what is already known about the app. Nothing is fetched until
**Check this app** is pressed — that call returns the release channels and the entire
build history in one go, so both appear together and there is no separate button for the
version list.

There is no status column. A check reports itself inside the expanded row: while it runs,
afterwards if it failed, and when a stored record turns out to have been left behind.

The headset picker sets `hmdType`, each option showing the store's codename — *Quest 3
(EUREKA)*, *Unknown (LOMA)* and so on. The sort dropdown reorders what is already listed
without re-querying: newest or oldest update, name A–Z or Z–A, price low to high or high
to low. It sorts on the same values the row displays, so a checked app sorts on what the
store just reported; anything with no date or no price (pre-orders, coming-soon) sinks to
the bottom either way.

The **Show** dropdown in the bottom-left is the result count, 5 to 100; it feeds
`firstSearchResultItems` and also caps what is rendered, because the server returns more
than it is asked for.

The Meta apps screen keeps its own filter, channel picker and sort (name A–Z, name Z–A,
newest build, oldest build; undated entries sink to the bottom either way).

### Channels

The Meta apps channel filter is built from whatever names appear in the file, so `LIVE`,
`Mainline Dogfooding`, `beta` or anything else shows up on its own once the data contains
it. An app with an empty `channels` array is filed under **Developer**.

A row summarises the channel marked `PRIMARY`, falling back to `LIVE`, then to the first
one listed, with `+n` when there are more; the expanded row lists every channel it has.

Both screens carry a **Dev build** column. It stays blank until an app is checked, then
reads `no`, or names the build. The bar is the newest build on **any** channel, not just
LIVE — an internal channel still counts as released — so a build only qualifies when it
sits above every channel, which means it is on none of them.

Internal builds often reuse the public version string and differ only by build number, so
the column shows the build number in that case rather than repeating the version. Hovering
gives the full version, upload date and channel.

Every column except the app name can be switched off under **Columns** in settings; the
choice applies to both lists and is remembered. Narrow screens still drop the secondary
columns to fit regardless. The built-in public token only ever returns `LIVE` / `PRIMARY`. A logged-in account token
sees more — `data/meta-apps.json` was seeded with one and contains `Mainline Dogfooding`,
`Release Dogfooding` and `Q4B Lufthansa Pilot Public RC`, all `group: CUSTOM`.

### More app info

Switching **Show the more app info button** on adds a button to each expanded app that
fetches the binary manifest — the same query a headset runs to decide what to download:

```
GET https://graph.oculus.com/graphql
    ?access_token=<token>
    &client_doc_id=38375779192687022983111059848
    &variables={"params":{"app_params":[{"app_id":"<id>","installed_version_code":"0", …}]}, …}
```

`installed_version_code` goes out as `0`: the query means "what should this headset
download", and claiming nothing is installed makes the store describe the whole latest
build rather than a patch against something else.

It returns package name, download size and space needed, file name, target Android SDK,
head-tracking requirement, external-storage flag, upload date, SHA-256, MD5, APK cert
signature, and the full permission list. The required OS version is not a field — it
arrives as a `dependency_configs` entry with identifier
`com.oculus.dependency.required_os_version_name`.

The reply also carries CDN download URIs for the binary. Those are not surfaced.

## Settings

Settings are stored in `localStorage` under `metadb.token`, `metadb.relay`,
`metadb.acToken`, `metadb.images`, `metadb.details` and `metadb.hidden`, and go nowhere except the requests themselves.

**Show app art in search results** — off by default. Store results carry cover art, and
switching this on loads one image per result straight from Meta's CDN.

**Show the more app info button** — off by default. See above.

**Access token** — leave it empty to use the built-in public one, which is enough for
public LIVE builds and nothing else. Store search and package lookups need a token that
belongs to a logged-in account.

To get yours: sign in at `https://secure.oculus.com/`, open developer tools, and under
**Application → Storage → Cookies** copy the value of the `oc_www_at` cookie. It signs in
as you, so treat it like a password.

**Account token** — the `oc_ac_at` cookie from the same place. Downloads authenticate
with this one; every other request uses the access token above. Without it the Download
buttons have nothing to sign with, so they lead back to Settings instead.

**Relay URL** — required for any check to work from a browser, and the reason is not
the token. `graph.oculus.com` answers with:

```
Access-Control-Allow-Origin: https://facebook.com
```

so a browser on any other address performs the request and is then refused the
response. That is decided by the page's origin, so no token changes it. Anything that
is not a browser can call the endpoint directly with no trouble.

This is exactly why the same request succeeds in Insomnia, Postman or curl and fails on
a page — none of those are browsers, so nothing enforces the rule. A failing check in
DevTools looks like a request that went out and came back with nothing.

A relay is a small service you control that fetches the URL server-side and returns it
with permissive CORS headers. Put `{url}` where the encoded target should go; without
it, the target is appended.

### Locally

```
node tools/relay.mjs
```

Then open Settings and press **use the local relay**, which fills in
`http://127.0.0.1:8788/?url={url}` and saves it. The relay only forwards `oculus.com`
URLs and only listens on `127.0.0.1`; it is for development, not for hosting.

### Deployed

A Cloudflare Worker is enough:

```js
export default {
  async fetch(request) {
    const target = new URL(request.url).searchParams.get("url");
    if (!target) return new Response("no url", { status: 400 });
    const upstream = await fetch(target);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
```

Deployed at `https://your-worker.workers.dev`, the relay URL is
`https://your-worker.workers.dev/?url={url}`.

**Test connection** saves what is in the boxes, runs a real lookup against the first Meta
app on file, and reports what came back.

## Checking for updates

`js/check.js` is the only file that makes requests. It exports `checkApp(app)` and
`lookupApp(id)`. The request is:

```
GET https://graph.oculus.com/graphql
    ?access_token=<token>
    &doc_id=2885322071572384
    &variables={"applicationID":"<id>"}
```

`primary_binaries.nodes` is every binary ever uploaded for the app, and each one carries
`binary_release_channels` naming the channels it was published to. Two answers come out of
that single reply:

- **`version`** — the newest build that reached a channel. This is what the status column
  compares against, because it is what people can actually install.
- **`newest`** — the newest build of any kind, usually an internal one with no channel.
  Shown as *Newest build* in the expanded row, and flagged in the status as `dev ahead`
  when it is out in front of everything released.

The channel list is derived the same way: walking newest-first, the first appearance of a
channel is its current build. That means channels come from the binaries themselves rather
than from a separate query.

A worked example — Beat Saber's LIVE channel sits at `1.44.3_23042` (build 2811) from
July, while the newest upload is `1.100.2_25875` (build 2972) from August with no channel
attached. So it is simultaneously up to date and two months behind internal.

### Cost of this

The older channel-only query, `doc_id=3828663700542720`, answers "what is on LIVE" in about
**0.6 KB**. The history query answers far more but returns about **625 KB** for Beat Saber,
because it lists all 2956 builds. Checking a long list moves real data.

It is not wasted, though — a check hands its build list straight to the version viewer, so
**List all versions** on a checked app costs no further request. If checking ever feels too
heavy, the lighter query is a drop-in for `checkApp`; it just cannot report `newest`.

**Check shown** covers every row currently listed. **Check this app** in an expanded row
does a single lookup. Both update only the rows they touch, so a long list is not
re-rendered on every result, and a checked row switches to showing the store's current
version rather than whatever it was compared against.

The version query takes **one app per call**. An array on `applicationID` comes back
`noncoercible_variable_value`, an `applicationIDs` variable comes back
`missing_required_variable_value`, and Facebook-style `batch=[…]` is not supported here, so
a whole list cannot go out as a single request. Instead six checks run at once, which is
what actually makes a long list quick.

### Build history

### Downloading a build

Rows in the build history that reached a channel carry a **get** link. It points at the
store's own endpoint:

```
https://securecdn.oculus.com/binaries/download/?id=<binary id>&access_token=<oc_ac_at>
```

It goes straight to the CDN rather than through the relay, because it is a file rather
than JSON. Meta decides whether to serve it — the account has to be entitled to the app,
so this is not a route around ownership. Builds that never reached a channel get no link.

The history has its own order picker: newest or oldest first, build number high to low or
low to high, or released first, which floats the handful of builds that reached a channel
to the top of a list that is mostly internal.

A check also lists every binary it received. Beat Saber has 2956, of which 126 were ever
attached to a channel; Gorilla Tag has 6559. Builds that shipped are shown in full colour
with the channel named, the rest dimmed. It renders 100 at a time and caches per app, so
reopening a row is instant.

### Store search

The collapsible panel on the Apps and games screen takes four kinds of input, and decides
which is which from the text itself:

| Input | What happens |
|---|---|
| An app ID | fetched directly |
| A `meta.com` store link | the ID is pulled out of it, then fetched |
| An Android package name | resolved to an ID, then fetched |
| Anything else | treated as a name and sent to the store's search |

Search uses:

```
GET https://graph.oculus.com/graphql
    ?access_token=<token>
    &doc_id=3928907833885295
    &variables={"query":"<text>","hmdType":"EUREKA","firstSearchResultItems":5}
```

`hmdType` picks which headset's store to search — `EUREKA` is Quest 3. Like the package
query, this one answers `Unauthorized logged out query` to an app token, so it needs a
logged-in account token from the Settings page; the built-in public one will not do.

Apps live at:

```
data.viewer.contextual_search.all_category_results[]
  .search_results.nodes[].target_object
```

Two things about that shape. Results are grouped into categories — `APPS` and `CONCEPT`
(labelled "More Apps and Games") — and the same app can appear in both, so they are
collapsed by ID with the first category winning. And the node's own `id` is an opaque
base64 story ID; the app ID is on `target_object`.

Each result carries name, price (`current_offer.price.formatted`, absent on pre-orders and
coming-soon), release date and cover art, and the platform is read off the end of
`canonicalName` — `…-android6d0f` means Quest. Results become the table on the Apps and
games screen; opening one fetches its channels and builds.
