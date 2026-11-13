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

## Extension 1.5 — 2026-11-11

- MetaDB now asks the store through the extension instead of through its own server, so
  pages load the same but nothing goes through the site's relay. Only MetaDB's pages can
  use this, only for Meta's store, and no cookies are sent.
- Requests go out as a headset's app manager would send them, like before. Adds the
  "declarativeNetRequestWithHostAccess" permission, which sets that one header.

## Site v=268 — 2026-11-11

- **Fewer menu entries: related screens are now tabs of one screen.** User → Library
  holds Entitlements, Purchases, Store credit and Wishlist; User → Headsets holds your
  headsets and the Updater; Apps → Store holds Store front and Horizon+. Store credit moved
  out of the bottom of Purchases into its own tab. Every tab keeps its own address
  (`/purchases`, `/updater`, `/plus` and the rest still open the right tab), and each one
  can still be switched off on its own in the setup guide, which drops its tab. On a phone
  the tabs scroll sideways and the open one is scrolled into view.
- **Revisions open to what they were.** In an expanded app's Builds tab, each row of
  the Revisions table opens to that submission: its review and release state, when it
  was published, the build it shipped and the store listing it set (publisher,
  category, genres, comfort, play area, languages…), and what changed in the build and
  listing since the revision before it. Fetched when the row is opened (a failed read is
  asked again on the next open), switchable under Extra lookups. Needs your own access
  token.
- **Channels and Revisions read properly in an expanded app.** They were squeezed side by
  side, so a channel's date scrolled out of sight and an opened revision was a narrow strip;
  now Channels runs the full width with Revisions under it (about ten rows before it
  scrolls), and an opened revision lays its groups side by side. On a phone the revisions
  drop the submissions count and let the ID wrap, so nothing runs off the edge. The app's
  name is now a bar that stays at the top with Close on it, so the page scrolls under the
  bar instead of under a loose button.
- **A home dashboard** at `/home`, reached from the MetaDB logo and from the 404
  page's new button. It is a front page, not the default screen — Apps and games
  still is — with panels built from what this browser already knows: your watchlist
  (apps with a new build first), the apps you have recently opened, and your
  account/setup status (sign-in, downloads, how requests go out, how many apps you
  watch). It works signed out and makes no request on arrival — with one exception:
  a watched or recently-viewed app that kept no icon has its one fetched from the
  store and filled in (and saved, so it is instant next time).
- **More apps show their icon.** A search row now shows any icon the app already
  carries (its launcher icon, not just the square cover), an app looked up by ID now
  comes back with its square icon (from the product-page query, the one place it can
  be had by ID), the search falls back through cover → icon → poster, and the
  watchlist/dashboard fill in any still-missing icons — so letter-tile and blank
  placeholders are rare rather than common. (The by-ID icon needs you signed in.)
  Every list does this now — search, store front, wishlist, Horizon+, organizations,
  default apps, entitlements, package search and the ADB tab: the store front and
  organizations no longer show a cropped landscape banner where the icon belongs,
  and any row whose list sent no art at all gets its icon fetched by ID.
- **Marking owned apps covers your PC library too.** The "mark owned apps" setting now
  loads your Rift (PC) library alongside your Quest one, so a title you own on either
  store is flagged across the site, whichever library the Entitlements screen shows.
- **The dashboard has a full "Your account" section** under the watchlist and
  recently viewed panels: your profile photo (looked up by your alias when the
  "who am I" reply leaves it out), name and @alias, with your email and account ID
  each hidden behind a Show button until you press it. Under that, three sets:
  **Account details** — the name on the account, country, language, birthday, when
  it was made, time zone, whether it is verified and its type, whichever of these the
  store gives (it works out which fields your account answers and remembers them);
  **Activity** — your presence in full (in VR now or when you last were, the app and
  the destination in it, lobby or match, party size, and whatever else the presence
  reply says, such as status and platform), your Quest and PC library counts and the
  worlds you have published; and **This browser** — which sign-ins are saved and how
  requests go out. Account details come from the headset's own account queries (out
  of the system apps in a Quest firmware): the age on the account, whether it is a
  Salsa account, a developer account, linked to Facebook, its profile standing, its
  privacy settings and its active-status setting — plus your email and photo. The
  account parts are asked together once per sign-in; anything the store will not give
  is left off rather than shown blank.
- **A People screen** (User → People): the people you follow, as the headset's People
  tab lists them — each one's photo, whether they are online and what they are doing
  ("Last seen 1 day ago"), whether they follow you back and whether you can message
  them — with your follower, following, follow-request and recently-met counts above.
  Filter by name, by who is online, or by who follows you back. Needs your Meta
  sign-in.
- **More People lists**, picked beside Get people: follow requests, people you
  recently met (where — "Met in Worlds" — and how long ago), who is in your lobby
  right now, and your chats (who is in each, its last message, unread or not, and
  whether someone is in it now). Each list is fetched only when you press Get people.
- **More account details on the dashboard**: who can talk to you by voice, who can join
  you without an invite, and which kinds of community you may create. The account
  details ask only what they show: the older privacy queries only if the newer one is
  refused, supervision only on a supervised account, the background only with images
  on, and the sign-in that answered is tried first after that. The
  privacy and active-status settings now read as the headset words them ("Online",
  "Appear offline"). With images on, your profile's background picture (a square)
  shows whole beside your name, with your photo over its corner.
- **Search everything** (Apps → Search everything): the headset's own search box —
  apps, movies, TV series, sports events, Xbox cloud games and people, up to ten of
  each. An app opens its panel; an Xbox game opens Xbox Cloud Gaming in a new tab.
  Search with the box empty for what the headset suggests before you type: your
  recent apps (with when you last opened them), people and websites. Needs your Meta
  sign-in.
- **Photos** (User → Photos): the photos and videos your headsets have uploaded, as
  the headset's Gallery lists them — a grid, newest first, with the app or world each
  was taken in and each video's length; filter to photos, videos or favourites, and
  open any one full size. Get photos fetches every page by itself, drawing each as it
  lands (the button counts as it goes), and **Taken from / to** narrows what is loaded
  to a date range, instantly and exactly. Needs your Meta sign-in.
- **Store account on the dashboard**: store credit, the subscriptions you pay for (and
  when each next bills), whether a store PIN is set, and the store content filter.
- **Library → Store credit**: the balance, what added to it or was paid from it, and
  your app-referral totals for the year.
- **More like this on an app's Store tab** (once checked): the store's related apps,
  with their prices and which you own.
- **Every person gets a photo**: people the store's lists carry no picture for (the
  complete follower lists, and people in Search everything) are filled in with one
  batch request — switchable under Extra lookups.
- **Store → Store front → For you → Apps you might like**: the headset Store's picks for this
  account, as its search shows them before you type. Needs your Meta sign-in.
- **A switch for every extra lookup**: the setup guide (first visit, or Settings) has
  a new list, Extra lookups, with one switch per request MetaDB sends alongside a
  screen — each piece of the dashboard, the complete follower lists, last-met times
  and profile counts on People, and an app's or world's extras. Anything switched off
  is never asked for, and its row disappears.
- **Avatar → Your avatars**: every avatar on the account, full body, with the style
  and the profile each is assigned to.
- **Worlds**: a world's details add its genres, content rating, whether you have
  visited, and similar worlds, from the headset Store's world page.
- **Included in** on an app's Store tab: the bundles it is sold in.
- **Fixes from a code review**: names the store supplies (similar worlds, an app's
  destinations, bundles and related apps) and a picked backup file's name are escaped
  before they reach the page, so a world titled with HTML cannot run script. The
  dashboard asks again as soon as the Meta token, images or an extra lookup changes,
  instead of after a reload. People gets your id from the profile query alone rather
  than the whole dashboard batch, fills in each person's follow relation from which
  list they are on when the store leaves it out, and a profile fetch that failed
  outright is no longer kept for the visit.
- **Layout fixes**: the GitHub button and the Show picker no longer float over the page
  (GitHub is a link in the footer line; Show sits beside Search and Check shown on
  Apps and games). A long name in a details list (Similar worlds, More like this)
  wraps instead of squeezing its value to one letter a line. A world's launch link
  shows as the link itself, not the store's JSON, and a picture that fails to load
  goes rather than leaving an empty frame. The Search everything box is wide enough
  for its hint; the store-credit Amount header matches the others; avatar previews
  are cropped to the figure; a chat with only you in it says so; People you may know
  keeps the store's ranking; and the line under your name on the dashboard wraps
  without leaving a dot at the end.
- Text actions inside sentences ("Take the tour" and the like) are no longer blue,
  default-underlined links: neutral text with a light underline that darkens on hover.
- **Horizon+ shows everything, section by section**: the screen now reads the
  Horizon+ tab of the headset's Store and loads each of its sections in full — this
  month's games, the catalog, the indie catalog (the half of "100+ games" it used
  to miss: 102 games now, not 52) and the Xbox Game Pass titles, which are listed
  under the games as Also in Horizon+. The section picker is the store's own list,
  so a section Meta adds later — movies, say — appears without a change here.
- **Movies and TV in Search everything open to their page**: the art, what it is
  about, genres, year, length or seasons, the age rating, and where to watch it —
  each service (Disney+, Prime Video, Pluto in the browser…) a link that opens the
  title there. Fetched when the row is opened.
- **Avatar → Stickers**: the animated stickers made from your avatar, as the headset
  offers them in chats, on their own Get stickers button.
- **Horizon+ on the dashboard**: whether this account is subscribed.
- **People, complete**: Following and followers now lists everyone, not just the
  first part the headset's blended list returns. New list: People you may know.
  Open anyone for their profile — username, private or public, Facebook name, what
  they are doing, whether you can call them in VR or join them, unread messages, bio,
  and how many followers and following they have.
- **Traits and destinations on an app's Store tab** once it is checked: gameplay,
  action, theme, art style, immersion, play area and pricing, as the headset's library
  groups apps; and the places in the app you can launch straight into, with how many
  can go in one group.
- **Cloud backups**: the download address is no longer printed under the button.
  A downloaded backup can be read on the page (Read a downloaded copy): its format,
  the key that locked it, how many encrypted records it holds and their sizes, and
  whether it matches the store's checksum. The file is read in the browser and sent
  nowhere; what is inside stays encrypted to the headset that made it.
- **Worlds → Top lists → Your headset's feed**: the worlds your headset's home suggests
  to you, each opening to the same details as any other world.
- **Cloud backups can be downloaded.** A backup's details now find its download
  address wherever the store's reply puts it — a single file gets a Download button,
  a backup uploaded in pieces gets one per segment — instead of only looking under
  one field name and reporting "No download address returned." When there truly is
  no address, the row lists the field names the reply did carry.
- **The dashboard's library count fills in by itself.** With "mark owned apps" on, the
  library loads on its own; the dashboard now says "Loading…" until it lands and
  then shows the counts, instead of offering a load that had already started.
- **No repeats on the dashboard:** an app on your watchlist no longer shows again
  under Recently viewed, the watched count lives only in the watchlist panel, and
  "Not affiliated with Meta" is said once, in the footer.
- **Organizations load much faster, without stutter.** Each request asks for up to 500
  apps (stepping down to 100, then 20, if the store will not take that, and
  remembering the size that worked), so most organizations arrive in one or two
  requests instead of dozens. Apps appear as each page lands, drawn a hundred per
  frame and added below the ones already shown — nothing already on screen is redrawn,
  so the page never freezes or flickers. An organization you have already opened in
  this visit comes back instantly, with no request.
- **Checks run several at a time**, not one after another: the watchlist sweep and a
  multi-headset OS check now fire their requests in parallel (a few at once), so a
  long watchlist or a stack of headsets finishes in a fraction of the time.
- **The 404 page** now leads with a clear "Go to the home page" button before its
  list of links.
- **The Updater reaches Meta again on the live site:** when the US relay hands back
  an unusable reply (a worker error page instead of Meta's JSON), the relay now
  falls back to asking Meta directly, instead of letting the page report "could not
  reach graph.oculus.com".
- **OS builds show when they were released, and how big they are:** each build the Updater
  turns up now lists its release date and time (from the build's creation time) and its
  download size among its main facts, instead of being tucked under Details. The date reads
  whether the store sends it as a number or a timestamp like `2026-11-10T17:33:18+0000`, and
  the size rides along in the finder's CSV too.
- **Import tokens** in Settings reads a `metadb-tokens.json` (what Export tokens saves) back
  in, so a sign-in can be carried from one browser to another: it fills in and saves whichever
  of your access, account, Meta and updater tokens the file holds.
- **Cloud tab reads normally again:** an opened backup's note (and the "no download address"
  line) was being drawn in the table's monospace font and running off the side instead of
  wrapping. It now uses the body font and wraps like the rest of the prose.
- **With the extension installed, store requests go through it** (MetaDB Sign-in 1.5 or
  newer), not through the site's relay. If the extension ever fails, the relay takes over
  for the rest of the visit. Downloads still use the relay.
- **Leaderboards tab** on an opened app: each of its leaderboards, as everyone's top scores,
  your friends', or the scores around yours, with your best rank. Needs your own token.
- **Rift downloads check every segment** against its SHA-256 from the manifest, and fetch
  again if one arrives damaged. They also try Meta's servers directly first and only use the
  relay if that is refused. The Downloaded button's tooltip says which way it came and
  whether it was checked.
- **The watchlist shows each app's real icon**, whether or not app art is on for search
  results, using the app's square cover or icon rather than whatever picture the list it
  was added from had. An icon whose address has expired is replaced the next time that
  app shows up in a list, and falls back to the app's initial meanwhile, never a broken
  image.
- **A Cloud tab on each app** gathers its cloud backups in one place: the backups Meta holds
  for it across your headsets, each openable for its download address, size, segment count and
  checksum, plus what its developer puts in a backup (which paths are left out). A backup is
  end-to-end encrypted with a key kept on the headset, so it can be downloaded but only
  restored to a headset — the Cloud tab says so. Moved out of the Entitlement tab. Needs your
  own token.
- **Export tokens** in Settings saves your sign-in (the access, account, Meta and updater
  tokens) to a `metadb-tokens.json` file, to keep or move to another browser.
- **"Watchlist3" is fixed:** the setup guide and the default-screen picker no longer read
  the new-build count into the Watchlist's name.
- **A clear message for an app ID the store won't show**, saying why that might be and
  whether signing in could help, in place of "No apps matched."
- **Store requests now go out as the newer app manager** (OCMS 1050.0.0.0.677, headset
  build 53145330020900520).
- **Running the site locally is one command.** `node tools/serve.mjs` now serves the relay
  at `/api` and `/dl` too, the same addresses as the live site, and starts the ADB bridge,
  so there is nothing else to start and no relay URL to set. With a headset connected over
  adb it also reads the newest OCMS version and OS build off it.
- **Signed-in requests use the newest app-manager version.** Requests made with your own
  token go out as the newest OCMS seen on a headset; requests on the built-in public token
  keep the version set by hand.
- **The site's relay only answers the site.** Other websites, scripts and bots are turned
  away from `/api`, `/dl` and `/frl`, so they cannot use up the free hosting's daily
  allowance. Nothing changes for anyone using the site or the headset app, and the FRL-token
  snippet on Settings still works from auth.meta.com.
- **Downloads have their own address** (`/dl`), so a limit on store requests can never cut
  a Rift download off halfway.

## Site v=266 — 2026-11-07

- **Specific build lists its builds in one place.** Whatever **Ask for it** and the sweep
  turn up goes into one **Builds found** list under both, newest first, each build once,
  with **Save as CSV** and **Clear results** on the list itself. Ask says under its button
  whether the build was added, was already there, or came back empty.

## Site v=265 — 2026-11-07

- **Rift (PC) downloads are fast and light now.** A build used to come down a piece at a
  time and be held whole in memory before the .zip was saved, which on a big game ate
  gigabytes of RAM and froze the page. Now 8 pieces download at once and each is written
  straight into the .zip as it arrives, so memory stays flat however big the game is.
  Chrome and Edge ask where to save the .zip first; Firefox saves it through its normal
  downloads. The whole download — fetching, unpacking, checksumming and writing — runs in a
  background worker, so the page never lags while it runs. The .zip is ZIP64, so games with files over 4 GB open
  correctly too.
- Rift (PC) manifests and segments go out with no headers added by the relay — no Quest
  User-Agent, no OCMS headers. Quest APK downloads are unchanged.
- A Rift download signs with your oc tokens first (the account token, then the access
  token) and falls back to the FRL token from Sign in with Meta, then no token — first on
  the address the store gave, then on the plain one community downloaders use (the build
  id and get_manifest=1 only). The build's segments use whichever answered; if none does,
  the notice lists what each attempt got back.

## Site v=264 — 2026-11-07

- The sweep no longer lists "Or one already found" builds under **Sweep a build**.
- **Rift downloads no longer fail silently.** Chrome won't let a site write into Downloads,
  Desktop or Documents themselves, so picking one of those (or cancelling) used to just do
  nothing. Now a notice says to make a new folder inside one and pick that, with **Save as a
  .zip instead** right there. Any other failure pops up a notice with Meta's reason instead
  of only changing the button.
- A refused Rift download now says what actually came back — the HTTP status, the host and
  Meta's (or the relay's) own message — instead of always claiming the account is not
  entitled to the build.
- **Rift (PC) downloads work again.** Since the relays started sending every download
  with the headset's full OCMS identity (Oct 13), PC build manifests came back 404 for
  every Rift app. Rift manifests and segments now go out as they did before — the
  User-Agent and Accept only, no OS-build header and no retrying as other headsets. Quest
  APK downloads are unchanged.

## Site v=263 — 2026-11-07

- CompanionServer's headset sign-in now asks Meta for the account's existing session
  instead of opening a new one each time (`create_new_session: false`). CompanionServer
  is still hidden while it is finished.

## Site v=262 — 2026-11-07

- **Specific build works again.** Meta was answering every Ask and sweep with
  "An unknown error has occurred": the check went out without a `version`, which Meta needs.
  It now sends `version=1` (as the headset and the sweep script do) unless you type another.
- The Advanced token box takes **frl** too, to sign a check with your FRL token itself.

## Site v=261 — 2026-11-07

- **Updater is its own screen now (User → Updater).** OS updates moved out of the
  headset panel; a headset's Overview has a **Check for updates** button that opens the
  Updater with that headset picked. One **Switch to Advanced / Switch to Easy** button
  changes the whole screen.
- **Easy** is just your headsets: pick one or more, and each is checked with its own
  model's device type and every update path. Every build Meta returns is listed under
  each headset.
- **Advanced** adds **Specific build** and opens up the OS check, all typed by hand —
  every box starts empty and **only what you type is sent**. Use your own serial, device
  type (Quest 3S Xbox Edition and VR glasses included), version and token. Each shows
  exactly what will go out.
- **Specific build** asks for one build by its incremental, or **sweeps for builds**: a
  prefix, then a middle that counts up, then a suffix (52641960 + 0345 + 00520 is
  52641960034500520). Set From and To to sweep part of the middle, or leave them empty
  for 0000 to 9999. Each number is asked for as requested_version, with every path shown. Requests are paced (a
  few a second, a few at once, both adjustable); when Meta says it is going too fast it
  retries, then cools down and carries on, and gives up after five blocks. Stop and Find
  again picks up where it left off, and **Save as CSV** downloads what it found.
- **Starting a sweep is quicker:** paste any build incremental into **Sweep a build** and
  it keeps that build's prefix and suffix and sweeps the 4 digits between them from 0000
  to 9999 — 52641960034500520 sweeps 52641960000000520 to 52641960999900520. A whole
  copied row (`52641960034500520    v2.9.0`) works too, and the box keeps what you put in
  it. Builds already
  found by the OS check, Ask or a sweep are one click away. A line under Find builds says how many
  numbers it will try and roughly how long that takes, and points out a missing serial
  or device type before anything is sent.
- **Builds read Release Tag, Version, Incremental, Build Number and Release Channel**, with the date,
  checksum and the rest under Details. Version is the semantic version with a v (e.g. v2.9.0) when
  Meta gives one, else the build's display name.
- **Headsets are listed in release order** — Quest 1, Quest 2, Quest Pro, Quest 3, Quest 3S,
  Quest 3S Xbox Edition, VR glasses — on the Updater and on Headsets, where it is the new
  default sort (A–Z and Z–A are still there).
- On the Updater, headsets shared with you get their own row under **Shared with you**,
  below your own.
- A Quest 1 (which the account reports as OCULUS_SANTA_CRUZ) is now recognised as the
  Oculus Quest and checked as ota.vr.monterey.user, and shows its picture on Headsets. A Quest
  3S Xbox Edition is checked as ota.xse.panther.user.
- **Rift (PC) downloads are faster and no longer held in memory.** Segments now come down
  8 at a time instead of one after another. On Chrome and Edge, Download asks for a folder
  and writes the game's own files into it as they arrive — the build as it installs, in
  its own subfolder, however large — instead of packing everything into one in-memory
  .zip. Browsers without folder access (Firefox, Safari) still get a .zip. A segment that
  fails is retried twice before the download gives up.
- **CompanionServer is hidden for now** while it is finished: it is gone from the Device
  menu and the setup guide, and its address shows the not-found screen.
- **Links that go nowhere show a 404 screen** instead of quietly opening Apps and games,
  with the address that failed and links to the main screens.

## Site v=260 — 2026-10-29

- **A headset's Updates tab, redesigned and fully configurable.** Both checks, OS build and
  System apps, now have an **Options** fold with every setting the headset's own updater
  can send: current build, every path or only the next step, a specific target build, full
  image only, managed mode, delay in days, Android SDK version and security patch, minor
  releases only, the device type, and the updater's public token (so a check can run without
  signing in). System apps can be asked about one app at a time, the way the headset checks
  on demand. A badge on Options shows how many settings differ from the defaults, a box
  shows the exact request that will go out, and **Reset to defaults** puts them back.
  Choices are remembered in this browser. Left alone, the checks send what they always have.
- OS builds show as cards reading *from build → to build*, with channel, date and a folded
  **Details** (checksum, controller firmware, install options). System apps are a table with
  a **Download** on each row, plus a count line giving the total size and how many need a
  restart. Both have a **Raw reply** fold.
- Long build numbers are no longer rounded off when an OS check's build fills the System
  apps box.

- **CompanionServer command tabs tidied and lined up.** Each feature group is now a
  quiet card, and the cards sit in a grid so a tab reads as rows of aligned boxes instead
  of ragged newspaper columns. Commands that are just on or off — developer mode, MTP,
  crash reports, auto-wake and the like — are a single row with **Enable** and **Disable**
  buttons now, instead of a checkbox or a box you type a 1 or a 0 into.
- **The sign-in extension works in Firefox too** (128 or newer), so the Get the app steps
  and Settings mention Firefox alongside Chrome and Edge. CompanionServer and the USB tools
  still need Chrome or Edge — only those have Web Bluetooth and WebUSB; Firefox does not.

- **The Headsets screen opens each headset into a panel.** A headset is now a row you click
  open, the same as an app or an entitlement: a dropdown with tabs inside it. **Overview** lists
  the headset's details (model, serial, device type, update type, ownership); **Updates** checks
  for both OS builds and the system apps that ship with them; **Test channel** (owned headsets)
  shows the test channel's state and the one switch to turn it on or off. The Check updates button
  and the PTC column that used to sit on the row are gone — both live on their tab now. The table
  reads Device · Update type · Serial · Status, filling the width so it lines up with the controls.
- **The full headset updater, not just the OS check.** The Updates tab now runs both of the
  requests the on-device updater makes against Meta's `firmware_ota_update` service: the **OS build**
  (what build it would hand this headset, by serial and device type — shown with its download link),
  and the **system apps** that ship with a given OS build (the "train" — each app with its version,
  size, whether it needs a reboot, and its own download link). The OS build number flows into the
  app check. Nothing is installed; you get the builds and their links.
- **CompanionServer command tabs rebuilt.** Each tab's commands are grouped by feature (Wi-Fi,
  Casting, Controllers, and so on) with a short heading over a clean list of rows — the command's
  name on the left, its button or fields on the right. No more walls of description text (the
  "what it does" note is a hover tooltip now), and the Setup tab reads as the same kind of list
  instead of a standout wizard. The connect controls stay the one clear card at the top.
- **FRL token added to Settings.** A third token, the FRL (Meta-account) profile token the
  Meta Horizon app uses, sits with the Access and Account tokens. Sign in with Meta fills in
  all three, and Refresh tokens refreshes all three; one Save tokens button saves them. Needs
  the MetaDB Sign-in extension (1.4+) and that you are logged in to Meta in this browser.
- **Get the FRL token without the extension.** The FRL token box has a “Get it without the
  extension” snippet you run in the console on auth.meta.com (signed in); it mints the token
  and copies it so you can paste it in. The login steps run on that page, the rest through
  this site's relay.
- **Companion Setup signs the headset in and finishes first-time setup.** The CompanionServer
  Setup tab now has a “Sign in to your account” step, right where the Meta app does it: from
  the FRL token it mints the Meta and Horizon profile tokens the headset wants and sends the
  combined token (`META_SET_ACCESS_TOKEN_COMBINED`) with your account ID. The welcome flow is
  then skipped the default way (retail skip-NUX, DEFAULT) and marked complete.
- **Check for OS updates from the Headsets screen.** Each headset has a Check updates button
  that asks Meta's updater service for the OS builds offered to that headset (by its serial and
  model), the same request the on-device updater makes, and shows any build with its download
  link. A browser can't install an OS update, so this checks + downloads only. The updater token
  is minted from your FRL token the first time and saved in Settings (its own Updater token
  field, next to the others) so later checks reuse it; Get updater token mints one on demand.
- **The Setup tab reads as a guided wizard.** Numbered steps on a connecting rail, plain-language
  titles and one action each, instead of a stack of command rows — easier to follow start to finish.
- **CompanionServer tab tidied.** The Wi-Fi section drops the type-in-a-network and Easy Connect (QR)
  rows — the Scan picker covers joining a network. The intro is shorter with the fine print folded
  into a “How it works” note, and the connect controls sit in their own card with Connect as the
  primary button.
- If the FRL token can't be fetched, the reason now shows under the tokens instead of failing
  silently.

## Extension 1.4

- Sign in with Meta now also mints the FRL (Meta-account) profile token — the token the Meta
  Horizon app uses — from your signed-in Meta session the way the app does (native SSO →
  `xfr_create_profile_token`), and hands it to the site with the other two. Refresh tokens
  fetches a fresh one.
- Fetching it opens one brief background tab on meta.com that closes itself — the login step
  only works from a real meta.com page. You must be signed in to meta.com in this browser
  (separate from the Oculus sign-in). Adds the "scripting" permission.
- Works in Firefox now (version 128 or newer), as well as Chrome and Edge, from the same code:
  Firefox uses the promise-based `browser` API and an event-page background script, Chrome and
  Edge the `chrome` API and a service worker. Load it in Firefox from about:debugging → This
  Firefox → Load Temporary Add-on (pick manifest.json). Sets an add-on ID (for settings storage)
  and a minimum version of 128 (the account sign-in uses an API added there).

## Site v=254 — 2026-10-28

- **Builds made for one headset now download.** Some APKs are only served to the headset
  they were built for, and the store's CDN refused them when asked as a Quest 3. A refused
  download is now asked again as a Quest 2, Quest 3S, Quest Pro and Quest in turn, until one
  is served.

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
