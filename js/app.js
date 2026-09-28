import {
  checkApp,
  lookupApp,
  lookupByPackage,
  lookupPackages,
  fetchHistory,
  appDetails,
  storeListing,
  channelObbs,
  claimOffer,
  appPage,
  mergeMedia,
  spatialIcons,
  myEntitlements,
  myReleaseChannels,
  headsetPlaytime,
  cloudBackups,
  savedWorlds,
  ownedIaps,
  binaryDetails,
  worldDetails,
  lookupWorld,
  parseWorldId,
  worldShelf,
  WORLD_SHELVES,
  searchPeople,
  publishedWorlds,
  worldFlags,
  horizonPlus,
  recentPresence,
  accountDevices,
  orgApps,
  setDevicePTC,
  downloadURL,
  canDownload,
  riftMetadata,
  riftManifestBytes,
  riftSegmentBytes,
  searchStore,
  defaultApps,
  DEFAULT_APP_TRIGGERS,
  HMD_TYPES,
  parseAppId,
  loadSettings,
  saveSettings,
  clearSettings,
  needsRelay,
} from "./check.js?v=193";

const DEVICE = { ANDROID_6DOF: "Quest", ANDROID_3DOF: "Go", ANDROID: "Go", PC: "Rift" };

/* Apps that publish no channel at all are grouped under this label. */
const NO_CHANNEL = "Developer";

/* System apps are identified by package name and have no store ID, so they get
   keyed by package instead. Nothing else in the UI needs to care which it is. */
const keyOf = (app) => app.id ?? app.packageName;

/* Every optional column. The App name is not listed — a row with no name would
   be useless, so it is the one thing that cannot be switched off. */
const COLUMNS = [
  ["c-dev", "Device"],
  ["c-chan", "Channel"],
  ["c-price", "Price"],
  ["c-ver", "Version"],
  ["c-build", "Build"],
  ["c-date", "Date"],
  /* Only Your entitlements has these three — the library is the only thing
     that reports them — but they switch off the same way as the rest. */
  ["c-used", "Last played"],
  ["c-state", "State"],
  ["c-grant", "Source"],
  ["c-devb", "Dev build"],
];

/* Each theme is a palette in the stylesheet, named by its `data-theme` value.
   Adding another is a block of tokens there and a line here. "" follows the
   system, and keeps following it as the system changes.

   Up here with the other constants, not down beside initTheme: the init calls
   run before this module finishes evaluating, and a `const` declared below
   them cannot be read from one — the same trap the staged panel hit. */
/* Light first, then dark, then the two that are neither about lightness.
   Adding one is a palette in the stylesheet and a line here. */
const THEMES = [
  ["", "System"],
  ["light", "Light"],
  ["paper", "Paper"],
  ["dark", "Dark"],
  ["midnight", "Midnight Blue"],
  ["ember", "Ember"],
  ["forest", "Forest"],
  ["forest-deep", "Forest (deep)"],
  ["terminal", "Terminal"],
  ["contrast", "High contrast"],
];

/* Everything is sized in rem, so the root size is the size of the page. Kept
   inside a range that still lays out: below 11 the tables crowd, above 24 the
   two-column panel has nowhere to go. */
const FONT_MIN = 11;
const FONT_MAX = 24;
const FONT_DEFAULT = 16;

/* When the page checks whether a newer build has been published. Up here with
   the other constants because initUpdates runs before this module has finished
   evaluating, and a `const` further down would still be in its dead zone. */
const UPDATE_FIRST = 45_000;
const UPDATE_EVERY = 15 * 60_000;

/* Build history orders. `list` arrives newest-first from the store. */
const BUILD_SORTS = {
  newest: (a, b) => b.createdAt - a.createdAt,
  oldest: (a, b) => a.createdAt - b.createdAt,
  buildDown: (a, b) => Number(b.versionCode) - Number(a.versionCode),
  buildUp: (a, b) => Number(a.versionCode) - Number(b.versionCode),
  released: (a, b) =>
    Number(Boolean(b.channels.length)) - Number(Boolean(a.channels.length)) ||
    b.createdAt - a.createdAt,
};

const BUILD_SORT_LABELS = [
  ["released", "Released first"],
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["buildDown", "Build high to low"],
  ["buildUp", "Build low to high"],
];

/* ---------- sorting ---------- */

/* Sorts read the same values the row displays: a checked app sorts on what the
   store just reported, an unchecked store result on its release date. */
const dateOf = (app) =>
  results.get(keyOf(app))?.latest?.releasedAt ??
  primaryOf(app)?.releasedAt ??
  app.releasedAt ??
  "";

/** "$6.99" -> 6.99. Pre-orders and coming-soon carry no price at all. */
function priceOf(app) {
  if (!app.price) return null;
  const n = Number(String(app.price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Entries with nothing to sort on sink to the bottom whichever way it runs. */
function nullsLast(read, dir, compare) {
  return (a, b) => {
    const x = read(a);
    const y = read(b);
    if (x == null && y == null) return a.name.localeCompare(b.name);
    if (x == null) return 1;
    if (y == null) return -1;
    return dir * compare(x, y) || a.name.localeCompare(b.name);
  };
}

const blankToNull = (read) => (app) => read(app) || null;

/** Both directions of a text sort, as `<name>Az` and `<name>Za`. */
const alphabetical = (name, read) => ({
  [`${name}Az`]: nullsLast(read, 1, (x, y) => x.localeCompare(y)),
  [`${name}Za`]: nullsLast(read, -1, (x, y) => x.localeCompare(y)),
});

const SORTS = {
  /* The order the store returned — its own relevance ranking. A comparator that
     never reorders keeps it, since Array.prototype.sort is stable. */
  relevance: () => 0,
  az: (a, b) => a.name.localeCompare(b.name),
  za: (a, b) => b.name.localeCompare(a.name),
  newest: nullsLast(blankToNull(dateOf), 1, (x, y) => y.localeCompare(x)),
  oldest: nullsLast(blankToNull(dateOf), -1, (x, y) => y.localeCompare(x)),
  priceUp: nullsLast(priceOf, 1, (x, y) => x - y),
  priceDown: nullsLast(priceOf, -1, (x, y) => x - y),
  /* Entitlements only: what the library reports and the store does not. Each
     sorts on the words the column shows, and ties fall back to the name. */
  used: nullsLast((app) => app.lastUsed ?? null, 1, (x, y) => y - x),
  unused: nullsLast((app) => app.lastUsed ?? null, -1, (x, y) => y - x),
  ...alphabetical("state", (app) => (app.state ? words(app.state) : null)),
  ...alphabetical("source", (app) => (app.owned ? grantLabel(app.grant) : null)),
  ...alphabetical("device", (app) =>
    app.platform ? (DEVICE[app.platform] ?? app.platform) : null
  ),
};

const sorted = (list, mode) => [...list].sort(SORTS[mode] ?? SORTS.az);

const el = {
  rows: document.getElementById("rows"),
  empty: document.getElementById("empty"),
  sub: document.getElementById("sub"),
  count: document.getElementById("count"),
  q: document.getElementById("q"),
  hmd: document.getElementById("hmd"),
  sort: document.getElementById("sort"),
  searchGo: document.getElementById("searchGo"),
  checkAll: document.getElementById("checkAll"),
  binId: document.getElementById("binId"),
  binGo: document.getElementById("binGo"),
  binNote: document.getElementById("binNote"),
  binRow: document.getElementById("binRow"),
  binDownload: document.getElementById("binDownload"),
  tourAgain: document.getElementById("tourAgain"),
  limit: document.getElementById("limit"),
  limitbar: document.querySelector(".limitbar"),

  viewApps: document.getElementById("view-apps"),
  viewOrgs: document.getElementById("view-orgs"),
  viewDefault: document.getElementById("view-default"),
  viewDevices: document.getElementById("view-devices"),
  viewSettings: document.getElementById("view-settings"),

  devicesLoad: document.getElementById("devicesLoad"),
  serialToggle: document.getElementById("serialToggle"),
  devicesQ: document.getElementById("devicesQ"),
  devicesSort: document.getElementById("devicesSort"),
  devicesRows: document.getElementById("devicesRows"),
  devicesSub: document.getElementById("devicesSub"),
  devicesCount: document.getElementById("devicesCount"),
  devicesEmpty: document.getElementById("devicesEmpty"),
  devicesPresence: document.getElementById("devicesPresence"),
  ptcOut: document.getElementById("ptcOut"),
  sharedSection: document.getElementById("sharedSection"),
  sharedRows: document.getElementById("sharedRows"),
  sharedCount: document.getElementById("sharedCount"),

  orgId: document.getElementById("orgId"),
  orgQ: document.getElementById("orgQ"),
  orgPlatform: document.getElementById("orgPlatform"),
  orgSort: document.getElementById("orgSort"),
  orgGo: document.getElementById("orgGo"),
  orgPick: document.getElementById("orgPick"),
  checkOrg: document.getElementById("checkOrg"),
  orgRows: document.getElementById("orgRows"),
  orgSub: document.getElementById("orgSub"),
  orgCount: document.getElementById("orgCount"),
  orgEmpty: document.getElementById("orgEmpty"),
  defaultHmd: document.getElementById("defaultHmd"),
  defaultTrigger: document.getElementById("defaultTrigger"),
  defaultGo: document.getElementById("defaultGo"),
  checkDefault: document.getElementById("checkDefault"),
  defaultQ: document.getElementById("defaultQ"),
  defaultSort: document.getElementById("defaultSort"),
  defaultRows: document.getElementById("defaultRows"),
  defaultCount: document.getElementById("defaultCount"),
  defaultEmpty: document.getElementById("defaultEmpty"),
  viewPlus: document.getElementById("view-plus"),
  plusGo: document.getElementById("plusGo"),
  checkPlus: document.getElementById("checkPlus"),
  plusQ: document.getElementById("plusQ"),
  plusPick: document.getElementById("plusPick"),
  plusSort: document.getElementById("plusSort"),
  plusRows: document.getElementById("plusRows"),
  plusCount: document.getElementById("plusCount"),
  plusEmpty: document.getElementById("plusEmpty"),
  viewHeadset: document.getElementById("view-adb"),
  viewCompanion: document.getElementById("view-companion"),
  adbUsb: document.getElementById("adbUsb"),
  adbAddr: document.getElementById("adbAddr"),
  adbPairAddr: document.getElementById("adbPairAddr"),
  adbPairCode: document.getElementById("adbPairCode"),
  adbPair: document.getElementById("adbPair"),
  adbTcpip: document.getElementById("adbTcpip"),
  adbWireless: document.getElementById("adbWireless"),
  adbDisconnect: document.getElementById("adbDisconnect"),
  adbState: document.getElementById("adbState"),
  adbCount: document.getElementById("adbCount"),
  adbQ: document.getElementById("adbQ"),
  adbSort: document.getElementById("adbSort"),
  adbRows: document.getElementById("adbRows"),
  adbEmpty: document.getElementById("adbEmpty"),
  adbOut: document.getElementById("adbOut"),

  settingsForm: document.getElementById("settingsForm"),
  token: document.getElementById("token"),
  acToken: document.getElementById("acToken"),
  saveTokens: document.getElementById("saveTokens"),
  tokensOut: document.getElementById("tokensOut"),
  relay: document.getElementById("relay"),
  testBtn: document.getElementById("testBtn"),
  clearBtn: document.getElementById("clearBtn"),
  settingsOut: document.getElementById("settingsOut"),
  images: document.getElementById("images"),
  details: document.getElementById("details"),
  devDownloads: document.getElementById("devDownloads"),
  obb: document.getElementById("obb"),
  autoOwned: document.getElementById("autoOwned"),
  autoDlc: document.getElementById("autoDlc"),
  autoPlaytime: document.getElementById("autoPlaytime"),
  autoBackups: document.getElementById("autoBackups"),
  wide: document.getElementById("wide"),
  motion: document.getElementById("motion"),
  motionSpeed: document.getElementById("motionSpeed"),
  fontSize: document.getElementById("fontSize"),
  store: document.getElementById("store"),
  log: document.getElementById("log"),
  logField: document.getElementById("logField"),
  logBox: document.getElementById("logBox"),
  logClear: document.getElementById("logClear"),
  cols: document.getElementById("cols"),
  defHmd: document.getElementById("defHmd"),
  defSort: document.getElementById("defSort"),
  defMineSort: document.getElementById("defMineSort"),
  defBuildSort: document.getElementById("defBuildSort"),
  defTrigger: document.getElementById("defTrigger"),
  useLocal: document.getElementById("useLocal"),
  relayNote: document.getElementById("relayNote"),


  viewMine: document.getElementById("view-mine"),
  mineRows: document.getElementById("mineRows"),
  mineSub: document.getElementById("mineSub"),
  mineEmpty: document.getElementById("mineEmpty"),
  mineQ: document.getElementById("mineQ"),
  mineSort: document.getElementById("mineSort"),

  viewWorlds: document.getElementById("view-worlds"),
  worldQ: document.getElementById("worldQ"),
  worldLookup: document.getElementById("worldLookup"),
  worldLookupGo: document.getElementById("worldLookupGo"),
  worldLookupNote: document.getElementById("worldLookupNote"),
  worldSort: document.getElementById("worldSort"),
  worldLoad: document.getElementById("worldLoad"),
  worldMore: document.getElementById("worldMore"),
  worldTabs: document.getElementById("worldTabs"),
  worldShelf: document.getElementById("worldShelf"),
  worldShelfGo: document.getElementById("worldShelfGo"),
  creatorQ: document.getElementById("creatorQ"),
  creatorFind: document.getElementById("creatorFind"),
  creatorPick: document.getElementById("creatorPick"),
  creatorGo: document.getElementById("creatorGo"),
  creatorNote: document.getElementById("creatorNote"),
  worldCount: document.getElementById("worldCount"),
  worldRows: document.getElementById("worldRows"),
  worldEmpty: document.getElementById("worldEmpty"),

  theme: document.getElementById("theme"),
  navLinks: document.querySelectorAll(".nav a[data-view]"),
  navGroups: document.querySelectorAll(".navgroup"),

  libButtons: document.querySelectorAll("#view-mine [data-lib]"),
};

/** id -> { state, latest, error } */
const results = new Map();

/** id -> the store's own listing, filled in by a check. */
const listings = new Map();

/* App ID -> the artwork on its store page, once it has been asked for. Filled
   in by a check that fetched the offer, or by Show more images itself. */
const media = new Map();

/* Binary ID -> its OBB's binary ID, gathered per release channel when the
   setting is on. Binary IDs are unique store-wide, so one map serves every
   app and a build found through one channel stays found. */
const obbs = new Map();

/* Release-channel IDs already looked up, so a re-check of the same app never
   fires the same channel query twice. */
const obbChecked = new Set();

/** Why the last OBB lookup came back with nothing, when it did. */
let obbNote = "";
const open = new Set();


/** What the account owns, once it has been asked for. */
let mineList = [];
let mineNote = "";
let mineAsked = false;
let mineLoading = false;

/* The account's registered headsets, once asked for. Declared up here (not beside
   the devices functions) because initDevices runs during module setup, before a
   `let` further down would have initialized. */
let deviceList = [];
let devicesLoading = false;
let devicesAsked = false;
let devicesNote = "";
/* The headset fetch in flight, so anything else that needs the list while it
   is loading — playtime and backups can start together — waits for the same
   one rather than reading an empty list. */
let devicesPromise = null;

/* Serials identify a specific headset, so they are masked until asked for. The
   filter box still searches the real value either way. */
let showSerials = false;

/* The default-apps list for the headset/trigger last fetched. Ordinary store
   apps, so they render through the same row code as every other tab. Declared
   up here with the devices state for the same reason. */
let defaultList = [];
let defaultLoading = false;
let defaultAsked = false;
let defaultNote = "";

/* The Horizon+ games, fetched whole by their button and then filtered and
   sorted in place, like the default apps. */
const plusState = { rows: [], asked: false, loading: false, note: "" };

/* When the account was last active in VR, fetched alongside Get devices. */
const presenceState = { data: null, note: "" };

/* The connected headset, and what it has installed. Declared up here with the
   rest of the tab state because initHeadset runs during module setup. */
let adb = null;
/* What the headset reported, before the store has anything to say about it. The
   rows are derived from this and the library together, so the list can be
   fetched before the entitlements arrive and still fill in when they do. */
let adbInstalled = [];
let adbApps = [];
let adbBusy = false;

/* The keys (store id or package name) of everything the account owns, so the
   search and Meta lists can flag a row without walking the whole library each
   time. Rebuilt from mineList at the top of every render. */
let ownedKeys = new Set();

/** Which library is on screen — "quest", "pc" or "expired". */
let mineKind = "quest";

/* App ID -> { current, channels } from the account's release-channel query,
   filled in by a single Check this app (never by a sweep). */
const myChannels = new Map();

/* The account's playtime and cloud backups, for the Entitlement tab of an
   opened app. Each keeps what it last fetched, whether it has been asked,
   whether it is waiting, why it failed if it did, and the fetch in flight so a
   second ask joins it. Declared up here for the same TDZ reason as the devices
   state. */
const playState = { rows: [], asked: false, loading: false, note: "", promise: null };
const backupState = { rows: [], asked: false, loading: false, note: "", promise: null };

/* The in-app purchases the account owns, by app ID, for the DLC section of an
   opened entitlement. One library-wide fetch, the first time a panel wants it. */
const iapState = { rows: [], byApp: new Map(), asked: false, loading: false, note: "", promise: null };

/* Columns in the entitlements list: the store's eight, its own three, and DLC. */
const ROW_SPAN = { mine: 12 };

/* What an opened app's panel remembers between renders: the library-name
   fetch in flight, and which tab each panel was left on. */
const layoutState = {
  names: null,
  panelTabs: new Map(),
  /* App IDs whose release channels the Entitlement tab has asked for, and why
     the store refused, when it did. */
  channelAsked: new Set(),
  channelErrors: new Map(),
};

/* One build's details (AppBinaryCombinedQuery), by "appId:versionCode", so a
   build opened twice asks once. */
const buildInfo = new Map();

/* Worlds: which rows are open, world ID -> { loading, data, note }, and the
   worlds looked up by ID this visit, newest first. */
const worldOpen = new Set();
const worldInfo = new Map();
let worldLookups = [];
/* World ID -> { beta, streamable }, or "loading", asked for when a world opens. */
const worldFlagInfo = new Map();

const worldState = { rows: [], count: 0, asked: false, loading: false, note: "" };
/* The Worlds screen's paged lists — Top worlds and Creator — each with the
   cursor for its next page and how to fetch it, and which tab is on. */
const shelfState = { rows: [], cursor: null, label: "", fetchPage: null, asked: false, loading: false, note: "" };
const creatorState = { rows: [], cursor: null, label: "", fetchPage: null, asked: false, loading: false, note: "" };
let worldTab = "top";

/* App ID -> the Quest library's record, so the Entitlement tab can say whether
   the account owns an app. Fetched once. */
let libraryNames = null;

/* The app whose panel is filling the window, if any. Declared up here with the
   rest of the state because applyView runs before the module finishes
   evaluating, and reaching a later `let` from there is a TDZ error. */
let stagedApp = null;
/* Which list the staged app was opened from, so its panel opens on the same
   tab it would in the row. */
let stagedScope = null;

/** What the Apps and games table is currently showing. */
let listing = [];
let listingNote = "";
let searching = false;

/* The guided tour in progress, if any. Up here for the same TDZ reason:
   applyView asks about it while the module is still evaluating. */
let tour = null;

initTheme();
initFontSize();
initMotion();
initStage();
initNav();
initSearchBar();
initViews();
initSettings();
initOrgs();
initDevices();
initAccountTabs();
initDefault();
initPlus();
initHeadset();
initDirectDownload();
initTour();
initColumns();
/* The headset list has to exist before the defaults can select within it. */
fillHmdPicker();
initDefaults();
initUpdates();

/* ---------- new builds ----------
   A page left open on a tab for a week goes on running whatever it loaded that
   day, and there is nothing a deploy can do to reach it. So the page asks: it
   re-fetches its own HTML now and then and compares the ?v= on the stylesheet
   with the one it was itself loaded with. That number already changes on every
   deploy — it is the cache buster — so there is no build stamp to remember to
   update.

   Finding a new one it reloads, but only when that cannot lose anything: with
   the tab in the background, or with nothing typed into and no app expanded.
   Otherwise it says so and leaves the choice alone. */

function loadedBuild() {
  const link = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
  return link?.getAttribute("href").match(/[?&]v=(\d+)/)?.[1] ?? null;
}

async function publishedBuild() {
  const res = await fetch(location.pathname, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.text()).match(/style\.css\?v=(\d+)/)?.[1] ?? null;
}

/** Nothing in progress that a reload would throw away. */
function safeToReload() {
  if (document.hidden) return true;
  if (stagedApp) return false;
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false;
  return true;
}

let lastUpdateCheck = 0;

async function checkForUpdate() {
  /* Returning to the tab triggers this, so a burst of tab-switching could fetch
     the HTML over and over. At most once a minute is plenty for a build check. */
  const now = Date.now();
  if (now - lastUpdateCheck < 60_000) return;
  lastUpdateCheck = now;

  const mine = loadedBuild();
  if (!mine) return;

  let live = null;
  try {
    live = await publishedBuild();
  } catch {
    /* offline, or opened from disk — nothing to do either way */
    return;
  }
  if (!live || live === mine) return;

  /* Reloading once per new build at most. If the reload comes back still on the
     old build — a proxy holding the HTML, say — the page asks rather than
     spinning. */
  let already = null;
  try {
    already = sessionStorage.getItem("metadb.reloadedFor");
  } catch {}

  if (already !== live && safeToReload()) {
    try {
      sessionStorage.setItem("metadb.reloadedFor", live);
    } catch {}
    location.reload();
    return;
  }
  showUpdateNotice();
}

function showUpdateNotice() {
  if (document.getElementById("updateNote")) return;

  const note = document.createElement("p");
  note.id = "updateNote";
  note.className = "notice notice--update";
  note.innerHTML =
    'A newer version of this page has been published. ' +
    '<button type="button" class="linkbtn">Reload to get it</button>';
  note.querySelector("button").addEventListener("click", () => location.reload());
  document.querySelector(".wrap").prepend(note);
}

function initUpdates() {
  setTimeout(checkForUpdate, UPDATE_FIRST);
  setInterval(checkForUpdate, UPDATE_EVERY);
  /* Coming back to the tab is the moment a reload costs least and is most
     likely to be wanted. */
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkForUpdate();
  });
}

/* ---------- theme ---------- */

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * The page's root text size, which everything else is measured from.
 *
 * Applied on the way in as well as on every change, and clamped: a saved value
 * from a hand-edited localStorage should not be able to make the page
 * unreadable, and the box itself accepts anything typed until it is corrected.
 */
function applyFontSize(px) {
  /* Fractions are kept — 15.5 is a real size, and rounding it away was the box
     appearing to ignore what was typed. Two places is enough to stop float
     arithmetic writing 15.500000000000002 into the settings. */
  const size =
    Math.round(
      Math.min(FONT_MAX, Math.max(FONT_MIN, Number(px) || FONT_DEFAULT)) * 100,
    ) / 100;
  document.documentElement.style.setProperty("--font", `${size}px`);
  return size;
}

function initFontSize() {
  const size = applyFontSize(loadSettings().fontSize);
  el.fontSize.value = size;

  /* While typing: the page follows every keystroke that reads as a size in
     range, so the number can be judged against the page it is changing. The box
     is left exactly as typed — correcting it here would fight the typing, since
     the first digit of "20" is a 2. Out-of-range keystrokes simply do nothing
     until the field is left. */
  el.fontSize.addEventListener("input", () => {
    const typed = Number(el.fontSize.value);
    if (!el.fontSize.value.trim() || Number.isNaN(typed)) return;
    if (typed < FONT_MIN || typed > FONT_MAX) return;
    saveSettings({ fontSize: String(applyFontSize(typed)) });
  });

  /* On the way out — blur, Enter, the spinner — clamp and tidy, and put the
     corrected number back in the box so what it says is what the page does. */
  el.fontSize.addEventListener("change", () => {
    const applied = applyFontSize(el.fontSize.value);
    el.fontSize.value = applied;
    saveSettings({ fontSize: String(applied) });
  });
}

function initTheme() {
  fillOptions(el.theme, THEMES);

  let saved = "";
  try {
    saved = localStorage.getItem("theme") ?? "";
  } catch {}

  /* A palette that has since been removed falls back to following the system
     rather than leaving the picker showing something that does not exist. */
  el.theme.value = THEMES.some(([value]) => value === saved) ? saved : "";
  applyTheme();

  el.theme.addEventListener("change", () => {
    try {
      if (el.theme.value) localStorage.setItem("theme", el.theme.value);
      else localStorage.removeItem("theme");
    } catch {}
    applyTheme();
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!el.theme.value) applyTheme();
    });
}

function applyTheme() {
  document.documentElement.dataset.theme = el.theme.value || systemTheme();
}

/* ---------- motion ---------- */

/* Declarations, not consts: applyView runs before this module has finished
   evaluating, and it asks whether it may animate.

   The reader's own system setting outranks the page's: with reduced motion
   asked for, nothing here animates however the switches are left. Read each
   time rather than once, so changing it mid-session is honoured. */
function animates() {
  return (
    loadSettings().motion &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** How long one of these takes, in ms — the same number the CSS is given. */
function speed() {
  return Number(loadSettings().motionSpeed) || 180;
}

function initMotion() {
  applySpeed();
  el.motionSpeed.value = loadSettings().motionSpeed;
  el.motionSpeed.addEventListener("change", () => {
    saveSettings({ motionSpeed: el.motionSpeed.value });
    applySpeed();
  });
}

function applySpeed() {
  document.documentElement.style.setProperty("--speed", `${speed()}ms`);
}

/**
 * Play a one-shot animation, restarting it if it is already on the element.
 *
 * The class comes off again when it finishes, and that is not tidiness. An
 * element left holding a transform animation keeps a transform — an identity
 * matrix rather than `none` — and any transform makes it the containing block
 * for `position: fixed` inside it. Leave it on the section and the expanded
 * panel is fixed to the section instead of the window.
 *
 * `keep` is for the fade a panel leaves on: it has to hold its last frame
 * until the row underneath is rebuilt, and it is on its way out anyway.
 */
function play(node, className, { keep = false } = {}) {
  if (!node || !animates()) return;

  node.classList.remove(className);
  /* Reading layout between the two is what makes the browser start again
     rather than treat it as the same running animation. */
  void node.offsetWidth;
  node.classList.add(className);

  if (!keep) {
    node.addEventListener(
      "animationend",
      () => node.classList.remove(className),
      { once: true }
    );
  }
}

/* ---------- large display ---------- */

const isStaged = (app) => Boolean(stagedApp) && keyOf(stagedApp) === keyOf(app);

const stageEl = () => document.querySelector(".stage");

/**
 * Take the whole window for one app.
 *
 * The overlay is its own element with its own copy of the panel; the row it
 * came from is left exactly as it was, still holding its own. Nothing empties
 * itself as this opens, so there is nothing to see flicker underneath.
 */
function openStage(app, scope = null) {
  closeStage({ animate: false });

  stagedApp = app;
  stagedScope = scope;
  /* Nothing behind it should scroll while it is covering the page. */
  document.documentElement.classList.add("staged");

  const stage = document.createElement("div");
  stage.className = "stage";
  stage.append(appPanel(app, { staged: true, scope }));
  document.body.append(stage);

  play(stage, "stage-in");
}

/**
 * Put the window back.
 *
 * The overlay lives on <body> and the scroll lock on <html>, so anything that
 * can take it off screen has to come through here — otherwise the page is left
 * locked with nothing visible to unlock it, which is what Back used to do.
 */
function closeStage({ animate = true } = {}) {
  if (!stagedApp) return;

  /* The pictures are the panel's own second sheet, so they leave with it. */
  closeGallery({ animate });

  stagedApp = null;
  stagedScope = null;
  const stage = stageEl();

  const done = () => {
    stage?.remove();
    document.documentElement.classList.remove("staged");
  };

  if (!stage || !animate || !animates()) return done();

  play(stage, "stage-out", { keep: true });
  setTimeout(done, speed());
}

/** Rebuild what the overlay is showing — after a check, say. */
function refreshStage() {
  const stage = stageEl();
  if (!stagedApp || !stage) return;

  /* Keep the reader where they were in a list that may be hundreds long. */
  const at = stage.scrollTop;
  const inner = saveScrolls(stage);
  stage.replaceChildren(appPanel(stagedApp, { staged: true, scope: stagedScope }));
  restoreScrolls(stage, inner);
  stage.scrollTop = at;
}

/* ---------- the app's pictures ---------- */

const galleryEl = () => document.querySelector(".gallery");

/**
 * One picture, drawn the same in the sheet over a panel and in the art tab.
 *
 * Never bigger than the store rendered it: a 64px launcher icon stretched
 * across the column is a worse picture than a 64px icon. The tile art carries
 * no size in its URL and is not all one size, so it is simply left at whatever
 * the file turns out to be.
 */
function shotFigure(shot) {
  const cap = shot.natural
    ? ` style="width:auto"`
    : shot.width
      ? ` style="max-width:${shot.width}px"`
      : "";

  return `<figure class="shot">
    ${
      shot.kind === "video"
        ? `<video controls preload="none" playsinline${cap}
             src="${esc(shot.uri)}"
             ${shot.poster ? `poster="${esc(shot.poster)}"` : ""}></video>`
        : `<a href="${esc(shot.uri)}" target="_blank" rel="noopener">
             <img src="${esc(shot.uri)}" alt="${esc(shot.label)}"
                  loading="lazy"${cap}>
           </a>`
    }
    <figcaption>${esc(shot.label)}</figcaption>
  </figure>`;
}

/**
 * Meta's CDN drops the odd request when a dozen arrive at once. A picture that
 * does not arrive says so in its own frame, rather than leaving the browser's
 * broken-image icon standing in the grid.
 *
 * On the container and captured, since `error` from an image does not bubble.
 */
function watchShots(node) {
  node.addEventListener(
    "error",
    (e) => {
      const img = e.target.closest?.(".shot img");
      if (!img) return;

      const gone = document.createElement("div");
      gone.className = "shot-gone";
      gone.textContent = "didn’t load";
      img.replaceWith(gone);
    },
    true
  );
}

/**
 * A second sheet over the first: every picture the store page holds for one app.
 *
 * It covers the expanded panel rather than replacing it, so closing this one
 * puts the reader back where they were — the app they were already reading,
 * scrolled where they left it.
 */
function openGallery(app, shots, heading = `${app.name} — images`) {
  closeGallery({ animate: false });

  const gallery = document.createElement("div");
  gallery.className = "gallery";
  gallery.innerHTML = `
    <button type="button" class="stage-btn" data-close>Close</button>
    <h3 class="stage-title">${esc(heading)}</h3>
    <div class="shots">${shots.map(shotFigure).join("")}</div>`;

  gallery
    .querySelector("[data-close]")
    .addEventListener("click", () => closeGallery());

  watchShots(gallery);

  /* Opened over a panel the lock is already on; opened from a tab — the whole
     table at once — it has to take it itself, or the list scrolls underneath. */
  document.documentElement.classList.add("staged");

  document.body.append(gallery);
  play(gallery, "stage-in");
}

/** Take the pictures away again. The panel underneath was never touched. */
function closeGallery({ animate = true } = {}) {
  const gallery = galleryEl();
  if (!gallery) return;

  const done = () => {
    gallery.remove();
    /* The panel underneath, if there is one, still wants the page held still —
       it takes the lock off itself when it goes. */
    if (!stagedApp) document.documentElement.classList.remove("staged");
  };

  if (!animate || !animates()) return done();

  play(gallery, "stage-out", { keep: true });
  setTimeout(done, speed());
}

/**
 * Show everything the store page has for this app.
 *
 * The artwork arrives with the offer, so a checked app already has it and this
 * opens straight away; anything else fetches the same page query once and keeps
 * it. Nothing is fetched from Meta's CDN with app art turned off, which is why
 * the button is only there when it is on.
 */
async function showImages(app, button, out) {
  /* Three places art comes from, shown as one set with anything they have in
     common kept once:

       the store page — the big pictures, so they lead;
       the list the app arrived in — the library and the default-apps query both
         send their own icons and covers, which the page does not carry;
       this repo — the layered tile art a headset composes its shelf from, which
         the store does not publish at all.  */
  const show = (page, tiles) => {
    const shots = mergeMedia(page, app.media, tiles);
    if (shots.length) openGallery(app, shots);
    else out.innerHTML = `<p>The store has no artwork for this app.</p>`;
  };

  button.disabled = true;
  button.textContent = "Loading images…";
  out.innerHTML = "";

  /* Off the same table for every app, so this is one fetch a session. */
  const tiles = await spatialIcons(app.packageName).catch(() => []);

  if (media.has(app.id)) {
    show(media.get(app.id), tiles);
  } else {
    try {
      const page = await appPage(app.id, el.hmd.value);
      media.set(app.id, page.media);
      show(page.media, tiles);
    } catch (err) {
      /* An app that came with artwork of its own still has pictures to show, so
         a store page that refuses — an unpublished app, a Rift title, a token
         that may not read it — is a note beside them rather than instead. */
      out.innerHTML = `<p class="warn">No store page: ${esc(err.message)}</p>`;
      if (app.media?.length || tiles.length) show([], tiles);
    }
  }

  button.disabled = false;
  button.textContent = "Show more images";
}

/**
 * Give one app's panel the whole browser window, or give it back.
 *
 * The row is rebuilt rather than reshuffled: the panel is laid out from the
 * same markup either way, so the only thing that changes is which arrangement
 * it is built into — and a check that redraws the row mid-view keeps it.
 */
function toggleStage(app, scope = null) {
  if (isStaged(app)) closeStage();
  else openStage(app, scope);
}

function initStage() {
  /* This browser's scrollbar width. The page keeps its gutter reserved even
     while the sheet is up — that is what stops everything shifting — so the
     sheet is told to hang out over the gutter by exactly this much. Measured
     off a box of its own: reading it from the document at startup returns 0,
     because nothing has been laid out yet. */
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
  document.body.append(probe);
  document.documentElement.style.setProperty(
    "--sbw",
    `${probe.offsetWidth - probe.clientWidth}px`
  );
  probe.remove();


  /* One sheet at a time, topmost first: Escape over the pictures puts the
     reader back on the panel they opened them from, not on the list. */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (galleryEl()) closeGallery();
    else closeStage();
  });
}

/* ---------- views ---------- */

/* The nav menus. Click to open, click anywhere else — or Escape, or picking a
   screen — to close. Only one is open at a time, so opening one shuts the other. */
function initNav() {
  const close = (g) => {
    g.querySelector(".navmenu").hidden = true;
    g.querySelector(".navtop").setAttribute("aria-expanded", "false");
  };
  const closeAll = () => {
    for (const g of el.navGroups) close(g);
  };

  for (const g of el.navGroups) {
    const top = g.querySelector(".navtop");
    const menu = g.querySelector(".navmenu");

    top.addEventListener("click", () => {
      const open = menu.hidden;
      closeAll();
      if (open) {
        menu.hidden = false;
        top.setAttribute("aria-expanded", "true");
      }
    });

    /* The link changes the hash, applyView takes it from there. */
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeAll();
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navgroup")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

function initViews() {
  window.addEventListener("hashchange", applyView);
  applyView();
}

function applyView() {
  /* Back, Forward or a tab in the nav — the panel belongs to the screen it was
     opened from, and its row is about to be hidden along with that screen.
     Nothing to fade out to, since that screen is going with it. */
  closeStage({ animate: false });

  const hash = location.hash.replace("#", "");
  const view = ["mine", "devices", "worlds", "orgs", "default", "plus", "adb", "companion", "settings"].includes(hash) ? hash : "apps";

  el.viewApps.hidden = view !== "apps";
  el.viewMine.hidden = view !== "mine";
  el.viewDevices.hidden = view !== "devices";
  el.viewWorlds.hidden = view !== "worlds";
  el.viewOrgs.hidden = view !== "orgs";
  el.viewDefault.hidden = view !== "default";
  el.viewPlus.hidden = view !== "plus";
  el.viewHeadset.hidden = view !== "adb";
  el.viewCompanion.hidden = view !== "companion";
  el.viewSettings.hidden = view !== "settings";

  if (view === "companion") {
    import("./companion.js?v=193")
      .then((m) => m.initCompanion(el.viewCompanion))
      .catch((e) => console.error("companion init failed", e));
  }

  /* the limit only governs the apps list, so hide it elsewhere */
  el.limitbar.hidden = view !== "apps";

  for (const a of el.navLinks) a.classList.toggle("on", a.dataset.view === view);
  /* A menu is marked as the current one when the screen on show is one of its own. */
  for (const g of el.navGroups) {
    g.querySelector(".navtop").classList.toggle("on", !!g.querySelector("a.on"));
  }
  window.scrollTo(0, 0);

  /* The screen that just arrived, not the one that left: a leaving screen
     would have to be kept on the page to be animated, and it is the arriving
     one the reader is looking for. */
  play(
    [el.viewApps, el.viewMine, el.viewDevices, el.viewWorlds, el.viewOrgs, el.viewDefault, el.viewPlus, el.viewHeadset, el.viewCompanion, el.viewSettings].find(
      (s) => !s.hidden
    ),
    "view-in"
  );

  /* The tour points at the Apps and games screen, so it waits for it — and
     leaving that screen mid-tour ends it. */
  if (view === "apps") maybeTour();
  else endTour();
}

/* ---------- organizations ---------- */

/* Apps published by the organization last looked up. They are ordinary store
   apps, so they render and expand through the same list code as every tab. */
let orgList = [];
let orgLoading = false;
let orgAsked = false;
let orgNote = "";

/* The list is fetched whole, then narrowed by platform and the filter box, and
   sorted — all on what is already loaded. "" platform means every platform;
   Oculus Go apps report either "ANDROID" or "ANDROID_3DOF". */
function orgVisible() {
  const p = el.orgPlatform.value;
  const q = el.orgQ.value.trim().toLowerCase();

  let list = orgList;
  if (p === "ANDROID") {
    list = list.filter((a) => a.platform === "ANDROID" || a.platform === "ANDROID_3DOF");
  } else if (p) {
    list = list.filter((a) => a.platform === p);
  }
  list = list.filter((a) => matches(a, q));

  return sorted(list, el.orgSort.value);
}

async function runOrgApps() {
  const id = el.orgId.value.trim();
  if (!/^\d+$/.test(id)) {
    orgList = [];
    orgAsked = true;
    orgNote = "Enter a numeric organization ID.";
    renderAll();
    return;
  }
  if (orgLoading) return;

  orgAsked = true;
  orgLoading = true;
  orgNote = "";
  el.orgGo.disabled = true;
  el.orgGo.textContent = "Loading…";
  renderAll();

  try {
    orgList = await orgApps(id);
  } catch (err) {
    orgList = [];
    orgNote = err.message || "Could not load the organization's apps.";
  } finally {
    orgLoading = false;
    el.orgGo.disabled = false;
    el.orgGo.textContent = "List apps";
    renderAll();
  }
}

function initOrgs() {
  el.orgGo.addEventListener("click", runOrgApps);
  el.orgId.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runOrgApps();
    }
  });

  /* The known-org dropdown fills the box and looks the org up in one choice,
     then resets so the same one can be picked again. */
  el.orgPick.addEventListener("change", () => {
    if (!el.orgPick.value) return;
    el.orgId.value = el.orgPick.value;
    el.orgPick.value = "";
    runOrgApps();
  });
  /* The whole list is fetched once; the platform, the filter box and the sort
     all work on what is already loaded, so they are instant and need no second
     request. */
  el.orgPlatform.addEventListener("change", renderAll);
  el.orgQ.addEventListener("input", renderAll);
  el.orgSort.addEventListener("change", renderAll);
  el.checkOrg.addEventListener("click", () =>
    checkList(orgList, el.checkOrg, "Check shown")
  );
}

/* ---------- default apps ---------- */

/* Filtered by the box and sorted, all on the already-fetched list. */
function defaultVisible() {
  const q = el.defaultQ.value.trim().toLowerCase();
  return sorted(defaultList.filter((a) => matches(a, q)), el.defaultSort.value);
}

function initDefault() {
  /* RIFT is the PC store; the default set is asked against the 6DOF store node,
     so a Rift pick only ever comes back empty. Leave it out here — the store
     search picker still carries it. */
  for (const [value, label] of HMD_TYPES) {
    if (value === "RIFT") continue;
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = `${label} (${value})`;
    el.defaultHmd.append(opt);
  }
  /* Default to the headset picked for store search, so the two tabs agree —
     unless that is the one headset this picker drops. */
  if (loadSettings().hmd !== "RIFT") el.defaultHmd.value = loadSettings().hmd;

  for (const [value, label] of DEFAULT_APP_TRIGGERS) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    el.defaultTrigger.append(opt);
  }
  /* Starts on whichever trigger Settings names. */
  el.defaultTrigger.value = loadSettings().defaultTrigger;

  el.defaultGo.addEventListener("click", runDefaultApps);
  /* The list is fetched once; the filter box and sort work on what is loaded. */
  el.defaultQ.addEventListener("input", renderAll);
  el.defaultSort.addEventListener("change", renderAll);
  el.checkDefault.addEventListener("click", () =>
    checkList(defaultList, el.checkDefault, "Check shown")
  );

}

async function runDefaultApps() {
  if (defaultLoading) return;

  defaultAsked = true;
  defaultLoading = true;
  defaultNote = "";
  el.defaultGo.disabled = true;
  el.defaultGo.textContent = "Loading…";
  renderAll();

  try {
    defaultList = await defaultApps(el.defaultHmd.value, el.defaultTrigger.value);
  } catch (err) {
    defaultList = [];
    defaultNote = err.message || "Could not load the default apps.";
  } finally {
    defaultLoading = false;
    el.defaultGo.disabled = false;
    el.defaultGo.textContent = "Get default apps";
    renderAll();
  }
}

/* ---------- horizon+ ---------- */

/* Narrowed to monthly or catalog, filtered by the box and sorted — all on the
   already-fetched list. */
function plusVisible() {
  const q = el.plusQ.value.trim().toLowerCase();
  const pick = el.plusPick.value;
  return sorted(
    plusState.rows.filter((a) => (!pick || a.plus === pick) && matches(a, q)),
    el.plusSort.value
  );
}

function initPlus() {
  el.plusGo.addEventListener("click", runHorizonPlus);
  el.plusQ.addEventListener("input", renderAll);
  el.plusPick.addEventListener("change", renderAll);
  el.plusSort.addEventListener("change", renderAll);
  el.checkPlus.addEventListener("click", () =>
    checkList(plusVisible(), el.checkPlus, "Check shown")
  );
}

async function runHorizonPlus() {
  if (plusState.loading) return;
  Object.assign(plusState, { asked: true, loading: true, note: "" });
  el.plusGo.disabled = true;
  el.plusGo.textContent = "Loading…";
  renderAll();

  try {
    plusState.rows = await horizonPlus();
  } catch (err) {
    plusState.rows = [];
    plusState.note = err.message || "Could not load the Horizon+ games.";
  } finally {
    plusState.loading = false;
    el.plusGo.disabled = false;
    el.plusGo.textContent = "Get Horizon+ games";
    renderAll();
    syncRelayNote();
  }
}

/* ---------- headset (adb) ---------- */

/* The bridge's address lives in adb.js, which is the only thing that talks to
   it; this is passed through so the signature keeps reading sensibly. */
const BRIDGE_URL = null;

function initHeadset() {
  el.adbUsb.addEventListener("click", () => connectHeadset("usb"));
  el.adbWireless.addEventListener("click", () => connectHeadset("wireless"));
  el.adbAddr.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      connectHeadset("wireless");
    }
  });
  el.adbDisconnect.addEventListener("click", disconnectHeadset);
  el.adbPair.addEventListener("click", pairHeadset);
  el.adbTcpip.addEventListener("click", switchHeadsetToWireless);
  el.adbPairCode.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pairHeadset();
    }
  });
  el.adbQ.addEventListener("input", renderAll);
  el.adbSort.addEventListener("change", renderAll);
  renderHeadset();
}

function adbSay(text, bad = false) {
  el.adbState.textContent = text;
  el.adbState.classList.toggle("bad", bad);
}

/* Switch the cabled headset to network mode and prefill where to reach it. The
   headset has to be connected over the cable first — this is a command sent to
   it, not a way of finding one. */
async function switchHeadsetToWireless() {
  if (!adb) {
    adbSay("Plug the headset in and press Find headsets first.", true);
    return;
  }
  el.adbTcpip.disabled = true;
  adbSay("Switching the headset to wireless…");

  try {
    const { switchToWireless, connectWireless, deviceInfo } = await import(
      "./adb.js?v=149"
    );
    const address = await switchToWireless(adb);

    if (!address) {
      adbSay(
        "Switched to wireless, but its address could not be read — find it " +
          "under Settings → Wi-Fi on the headset, then use Connect wirelessly."
      );
      el.adbTcpip.disabled = false;
      return;
    }

    el.adbAddr.value = address;

    /* Take the wireless connection now, while the cable is still in. The
       session was pointing at the USB serial, and that serial stops existing
       the moment the cable comes out — carrying on with it is what produced
       "device not found" on everything afterwards. */
    adbSay(`Connecting to ${address}…`);
    adb = await connectWireless(null, address);
    const info = await deviceInfo(adb);
    adbSay(
      `Connected to ${info.model} over wireless at ${address}. ` +
        `You can unplug the cable now.`
    );
    await loadHeadsetApps();
  } catch (err) {
    adbSay(err.message || "Could not switch to wireless.", true);
  }

  el.adbTcpip.disabled = false;
}

/* Pairing is not connecting: it leaves a key behind and nothing else. The
   connect step still has to happen, on the other port the headset shows. */
async function pairHeadset() {
  if (adbBusy) return;
  adbBusy = true;
  el.adbPair.disabled = true;

  try {
    const { pairDevice } = await import("./adb.js?v=149");
    const message = await pairDevice(
      el.adbPairAddr.value,
      el.adbPairCode.value,
      { onStage: adbSay }
    );
    adbSay(
      `${message} Now connect with the address under “IP address & Port”.`
    );
    el.adbPairCode.value = "";
    el.adbAddr.focus();
  } catch (err) {
    adbSay(err.message || "Could not pair.", true);
  } finally {
    adbBusy = false;
    el.adbPair.disabled = false;
  }
}

async function connectHeadset(how) {
  if (adbBusy || adb) return;
  adbBusy = true;
  el.adbUsb.disabled = true;
  el.adbWireless.disabled = true;
  adbSay(how === "usb" ? "Waiting for a headset to be chosen…" : "Reaching the bridge…");

  try {
    const { connectUsb, connectWireless, deviceInfo } = await import("./adb.js?v=149");
    const onStage = (text) => adbSay(text);
    adb = how === "usb"
      ? await connectUsb({ onStage })
      : await connectWireless(BRIDGE_URL, el.adbAddr.value, { onStage });

    const info = await deviceInfo(adb);
    adbSay(
      `Connected to ${info.model}${info.release ? ` — Android ${info.release}` : ""}.`
    );
    el.adbDisconnect.hidden = false;
    await loadHeadsetApps();
  } catch (err) {
    adb = null;
    /* The picker closing without a choice is not a failure worth shouting
       about — it is what pressing Cancel does. */
    const message = /no headset chosen|No device selected/i.test(err.message ?? "")
      ? "No headset chosen."
      : err.message || "Could not connect.";
    adbSay(message, !/No headset chosen/.test(message));
  } finally {
    adbBusy = false;
    el.adbUsb.disabled = false;
    el.adbWireless.disabled = false;
    renderHeadset();
  }
}

async function disconnectHeadset() {
  try {
    await adb?.close();
  } catch {}
  adb = null;
  adbInstalled = [];
  adbApps = [];
  el.adbDisconnect.hidden = true;
  el.adbOut.replaceChildren();
  adbSay("Not connected.");
  renderHeadset();
}

async function loadHeadsetApps() {
  if (!adb) return;
  el.adbCount.textContent = "Asking the headset what it has installed…";
  try {
    const { installedApps } = await import("./adb.js?v=149");
    adbInstalled = await installedApps(adb);

    /* Anything the library does not cover is asked about once, and remembered
       on the raw entry — so a later pass does not ask again. */
    const missing = adbInstalled
      .filter((a) => !ownedByPackage().has(a.packageName) && !a.resolved)
      .map((a) => a.packageName);

    if (missing.length) {
      el.adbCount.textContent = `Naming ${missing.length} packages…`;
      try {
        const known = await lookupPackages(missing);
        for (const entry of adbInstalled) {
          const match = known.get(entry.packageName);
          if (match) entry.resolved = match;
        }
      } catch {
        /* Without a logged-in token the names do not arrive. Those packages
           have no store ID either, so they are not listed at all. */
      }
    }
  } catch (err) {
    adbInstalled = [];
    adbSay(`Could not list the installed apps: ${err.message}`, true);
  }
  resolveHeadsetApps();
  renderHeadset();
}

/* The library, keyed by package. Read fresh each time rather than cached: the
   entitlements often arrive after the headset list, and this is what lets the
   rows fill in when they do. */
function ownedByPackage() {
  return new Map(
    mineList.filter((a) => a.packageName).map((a) => [a.packageName, a])
  );
}

/**
 * Turn what the headset reported into rows.
 *
 * Only apps the store knows are listed. A headset carries plenty that no store
 * entry exists for — sideloaded builds, system pieces — and there is nothing
 * this tab can do with one: no build history to offer, nothing to install.
 */
function resolveHeadsetApps() {
  const owned = ownedByPackage();

  adbApps = adbInstalled
    .map((a) => {
      const mine = owned.get(a.packageName);
      const match = a.resolved;
      const id = mine?.id ?? match?.id ?? null;
      if (!id) return null;

      return {
        id,
        packageName: a.packageName,
        name: mine?.name || match?.name || a.packageName,
        platform: mine?.platform ?? match?.platform ?? null,
        image: mine?.image ?? null,
        channels: [],
        /* An entitlement already knows the build the account may install, so
           the Latest columns are filled before any check runs; a check then
           replaces it with the live answer. */
        latest: mine?.latest ?? null,
        /* In the account's library — what the green edge means everywhere. */
        inLibrary: Boolean(mine),
        onHeadset: true,
        installedVersion: a.version,
        installedVersionCode: a.versionCode,
      };
    })
    .filter(Boolean);
}

/* The headset list is not a store listing, so it does not use the store row.
   What matters here is one comparison — what is on the headset against what the
   store has — and the columns are only that. Opening a row is the same panel
   every other tab opens. */
function adbRow(app) {
  const key = openKey("adb", app);
  const latest = results.get(keyOf(app))?.latest ?? app.latest ?? null;
  const showArt = loadSettings().images;

  const tr = document.createElement("tr");
  tr.className = "app";
  tr.dataset.id = keyOf(app);
  tr.tabIndex = 0;
  tr.setAttribute("aria-expanded", String(open.has(key)));
  tr.innerHTML = `
    <td class="name">${
      showArt && app.image
        ? `<img class="art" src="${esc(app.image)}" alt="" loading="lazy">`
        : ""
    }${esc(app.name)}</td>
    <td class="num">${esc(app.installedVersion ?? "—")}</td>
    <td class="num">${app.installedVersionCode ?? "—"}</td>
    <td class="num">${esc(latest?.version ?? "—")}</td>
    <td class="num">${latest?.versionCode ?? "—"}</td>`;

  const toggle = (e) => {
    open.has(key) ? open.delete(key) : open.add(key);
    focusId = keyOf(app);
    focusScope = e.currentTarget.closest("tbody");
    renderAll();
  };
  tr.addEventListener("click", toggle);
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(e);
    }
  });
  return tr;
}

/* Behind the store: the headset is on an older build than the latest known. */
function adbBehind(app) {
  const latest = results.get(keyOf(app))?.latest ?? app.latest ?? null;
  return Boolean(
    app.installedVersionCode &&
      latest?.versionCode &&
      app.installedVersionCode < latest.versionCode
  );
}

function adbVisible() {
  const q = el.adbQ.value.trim().toLowerCase();
  const list = adbApps.filter(
    (a) =>
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.packageName.toLowerCase().includes(q)
  );

  const byName = (a, b) => a.name.localeCompare(b.name);
  switch (el.adbSort.value) {
    case "za":
      return [...list].sort((a, b) => -byName(a, b));
    case "behind":
      return [...list].sort(
        (a, b) => Number(adbBehind(b)) - Number(adbBehind(a)) || byName(a, b)
      );
    case "installed":
      return [...list].sort(
        (a, b) => (b.installedVersionCode ?? 0) - (a.installedVersionCode ?? 0)
      );
    default:
      return [...list].sort(byName);
  }
}

function buildAdbRows() {
  const shown = adbVisible();

  const out = [];
  for (const app of shown) {
    out.push(adbRow(app));
    /* Five columns here, not the store table's eight. */
    if (open.has(openKey("adb", app))) out.push(detailRow(app, 5));
  }
  el.adbRows.replaceChildren(...out);

  el.adbEmpty.hidden = shown.length > 0;
  el.adbEmpty.textContent = !adb
    ? "Connect a headset to list what it has installed."
    : adbApps.length
      ? "Nothing matches."
      : adbInstalled.length
        ? "None of the installed apps are in the store — nothing here to put an older build on."
        : "Nothing installed that the headset will list.";

  const hidden = adbInstalled.length - adbApps.length;
  el.adbCount.textContent = adbApps.length
    ? `${shown.length === adbApps.length ? adbApps.length : `${shown.length} of ${adbApps.length}`} ` +
      `app${adbApps.length === 1 ? "" : "s"} from the store` +
      (hidden > 0 ? `, ${hidden} without one hidden` : "") +
      `. Open one to see every build, and install an older one.`
    : "";
}

/* Kept as its own name for the places that mean "the headset list changed". */
function renderHeadset() {
  buildAdbRows();
}

/* Put the build list back where it was. The row is rebuilt from scratch after a
   refresh, so the element holding the scroll position is a different one by the
   time this runs — it is found again by the app it belongs to, in the row and
   in the overlay, whichever is open. */
function restoreBuildScroll(app, top) {
  if (!top) return;
  const row = el.adbRows.querySelector(`tr.app[data-id="${keyOf(app)}"]`);
  const panels = [row?.nextElementSibling, stageEl()].filter(Boolean);
  for (const panel of panels) {
    const scroller = panel.querySelector?.(".versions-out .vscroll");
    if (scroller) scroller.scrollTop = top;
  }
}

/* Put one build on the headset.
 *
 * The APK comes from the store through the relay, exactly as the Download
 * button gets it; adb then installs it. Going backwards needs the uninstall
 * first — Android will not replace a build with a lower one — and that is
 * confirmed rather than assumed, because it takes the app's data with it.
 */
async function installBuild(app, { installBuild: binaryId, version, code }, button) {
  if (!adb) {
    adbSay("Connect a headset first.", true);
    return;
  }
  if (!canDownload()) {
    adbSay("Downloads need your oc_ac_at account token, set on the Settings page.", true);
    return;
  }

  const older =
    app.installedVersionCode && Number(code) < app.installedVersionCode;

  if (older) {
    const sure = window.confirm(
      `Put ${app.name} back to ${version}?\n\n` +
        `${app.packageName} will be uninstalled first, which deletes its saved ` +
        `data on the headset. This cannot be undone.`
    );
    if (!sure) return;
  }

  /* Refreshing after the install rebuilds the row, and with it the panel and
     the whole build table — which would otherwise drop the reader back to the
     top of a list they had scrolled a long way down. */
  const scrolledTo =
    button.closest(".versions-out")?.querySelector(".vscroll")?.scrollTop ?? 0;

  const label = button.textContent;
  button.disabled = true;
  const say = (text) => {
    button.textContent = text;
    adbSay(`${app.name}: ${text}`);
  };

  try {
    say("Downloading…");
    const res = await fetch(downloadURL(binaryId));
    if (!res.ok) throw new Error(`the store returned ${res.status}`);
    const blob = await res.blob();

    const { installApk, uninstall, pushObb } = await import("./adb.js?v=149");

    if (older) {
      say("Uninstalling…");
      await uninstall(adb, app.packageName);
    }

    await installApk(adb, blob, { onProgress: say });

    /* A build with an expansion file is no use without it, and the uninstall
       above takes the old one with it. The same pairing the build table shows
       with its OBB link beside the download. */
    const obb = obbs.get(String(binaryId));
    if (obb) {
      say("Downloading the expansion file…");
      const obbRes = await fetch(downloadURL(obb));
      if (!obbRes.ok) {
        throw new Error(
          `installed, but the expansion file returned ${obbRes.status}`
        );
      }
      await pushObb(adb, app.packageName, code, await obbRes.blob(), {
        onProgress: say,
      });
    }

    adbSay(
      `${app.name} is now on ${version}${obb ? ", expansion file and all" : ""}.`
    );
    await loadHeadsetApps();
    restoreBuildScroll(app, scrolledTo);
  } catch (err) {
    adbSay(`${app.name}: ${err.message}`, true);
    button.textContent = label;
    button.disabled = false;
    syncRelayNote();
    return;
  }

  button.textContent = label;
  button.disabled = false;
  syncRelayNote();
}

/* ---------- your devices ---------- */

function initDevices() {
  /* Get devices also asks when the account was last active — one more request,
     and only on this button, not when playtime or backups want the headsets. */
  el.devicesLoad.addEventListener("click", () => {
    loadDevices();
    loadPresence();
  });
  el.serialToggle.addEventListener("click", () => {
    showSerials = !showSerials;
    el.serialToggle.textContent = showSerials ? "Hide serials" : "Show serials";
    renderDevices();
  });
  el.devicesRows.addEventListener("click", onDevicePTCClick);
  el.devicesQ.addEventListener("input", renderDevices);
  el.devicesSort.addEventListener("change", renderDevices);
  renderDevices();
}

function loadDevices() {
  if (devicesLoading) return devicesPromise;
  devicesPromise = fetchDevices();
  return devicesPromise;
}

async function fetchDevices() {
  devicesAsked = true;
  devicesLoading = true;
  devicesNote = "";
  el.devicesLoad.disabled = true;
  el.devicesLoad.textContent = "Loading…";
  renderDevices();

  try {
    deviceList = await accountDevices();
  } catch (err) {
    deviceList = [];
    devicesNote = err.message || "Could not load your devices.";
  } finally {
    devicesLoading = false;
    el.devicesLoad.disabled = false;
    el.devicesLoad.textContent = "Get devices";
    renderDevices();
  }
}

async function loadPresence() {
  try {
    presenceState.data = await recentPresence();
    presenceState.note = "";
  } catch (err) {
    presenceState.data = null;
    presenceState.note = err.message || "Could not read when this account was last active.";
  }
  renderDevices();
}

/* When the account was last in VR, and where, as one line under the count. */
function presenceLine() {
  if (presenceState.note) return `Last active: ${presenceState.note}`;
  const p = presenceState.data;
  if (!p?.lastActive) return "";
  const when = new Date(p.lastActive * 1000).toISOString().slice(0, 16).replace("T", " ");
  const where = p.app ?? (p.destination ? words(p.destination) : null);
  return `${p.current ? "Active now" : "Last active"} — ${when} UTC${where ? `, in ${where}` : ""}.`;
}

/* All but the last character. Enough to see a serial is there and how long it
   is, without putting the thing itself on screen. */
function maskSerial(serial) {
  const s = String(serial ?? "");
  return s.length > 1 ? "•".repeat(s.length - 1) + s.slice(-1) : s;
}

function deviceStatus(d) {
  if (!d.wipeStatus || d.wipeStatus === "NONE") return "—";
  if (d.wipeStatus === "PENDING") return "Remote wipe pending";
  return words(d.wipeStatus);
}

function sortDevices(list, mode) {
  const byModel = (a, b) =>
    (a.model ?? "").localeCompare(b.model ?? "") || a.serial.localeCompare(b.serial);
  return [...list].sort(mode === "modelZa" ? (a, b) => -byModel(a, b) : byModel);
}

/* `testChannel` is off for the shared table: the store refuses the switch on a
   headset the account does not own. So the column comes off those rows
   altogether rather than showing a control that cannot work — which is why
   this drops the whole cell, not just the buttons inside it. The shared table
   is three columns wide as a result, and its header matches. */
/* A headset's picture, matched from its device type first — the codename is
   stable where the display name is not — and its model name as a fallback. The
   Xbox edition of the 3S shares the 3S codename, so that one is split out by
   name. Anything unrecognised (a Go, a new headset) simply shows no picture. */
const DEVICE_IMAGES = {
  OCULUS_MONTEREY: "img/Quest1.png",
  OCULUS_HOLLYWOOD: "img/Quest2.png",
  OCULUS_SEACLIFF: "img/QuestPro.png",
  OCULUS_EUREKA: "img/Quest3.webp",
  OCULUS_PANTHER: "img/Quest3S.png",
};
function deviceImage(d) {
  const type = (d.deviceType ?? "").toUpperCase();
  const model = (d.model ?? "").toLowerCase();
  const xbox = /xbox/.test(model);

  if (DEVICE_IMAGES[type]) {
    return type === "OCULUS_PANTHER" && xbox ? "img/Quest3SXbox.png" : DEVICE_IMAGES[type];
  }
  /* No codename match — read it off the model name. 3S before 3, so "3s" does
     not get caught by the "3" test. */
  if (xbox) return "img/Quest3SXbox.png";
  if (/quest\s*3s/.test(model)) return "img/Quest3S.png";
  if (/quest\s*3/.test(model)) return "img/Quest3.webp";
  if (/quest\s*pro/.test(model)) return "img/QuestPro.png";
  if (/quest\s*2/.test(model)) return "img/Quest2.png";
  /* Only the bare "Quest" is the original — a Go or a future headset that fell
     through every check above gets no picture rather than the wrong one. */
  if (/^(meta |oculus )?quest$/.test(model.trim())) return "img/Quest1.png";
  return null;
}

function deviceRowsHtml(list, { testChannel = true } = {}) {
  return list
    .map(
      (d) => `<tr>
      <td class="name">${
        deviceImage(d)
          ? `<img class="art" src="${esc(deviceImage(d))}" alt="" loading="lazy">`
          : ""
      }${esc(d.model ?? "Unknown device")}</td>
      <td class="num">${esc(showSerials ? d.serial : maskSerial(d.serial))}</td>
      <td>${esc(deviceStatus(d))}</td>${
        testChannel
          ? `
      <td class="ptc-cell"><button type="button" class="ptc-btn" data-ptc-serial="${esc(
        d.serial
      )}" data-ptc-on="1">Enable</button><button type="button" class="ptc-btn"
        data-ptc-serial="${esc(d.serial)}" data-ptc-on="0">Disable</button></td>`
          : ""
      }
    </tr>`
    )
    .join("");
}

function setPtcOut(text, bad = false) {
  el.ptcOut.textContent = text;
  el.ptcOut.classList.toggle("bad", bad);
  el.ptcOut.hidden = !text;
}

/* The rows are rebuilt by innerHTML on every render, so the listener sits on
   the table body once and reads the serial off whichever button was pressed
   rather than being re-attached to each. */
function onDevicePTCClick(e) {
  const button = e.target.closest("[data-ptc-serial]");
  if (!button) return;
  setDevicePTCOne(button.dataset.ptcSerial, button.dataset.ptcOn === "1", button);
}

/* Both switches on the row go dead while the request is out, so a second press
   cannot race the first. */
async function setDevicePTCOne(serial, enabled, button) {
  const buttons = [...button.closest("tr").querySelectorAll(".ptc-btn")];
  buttons.forEach((b) => (b.disabled = true));
  setPtcOut(`${enabled ? "Enabling" : "Disabling"} the test channel on ${serial}…`);

  try {
    await setDevicePTC(serial, enabled);
    setPtcOut(
      `Test channel ${enabled ? "on" : "off"} for ${serial}. The headset picks
       the change up when it next looks for an update.`
    );
  } catch (err) {
    setPtcOut(`Not changed: ${err.message}`, true);
  }

  buttons.forEach((b) => (b.disabled = false));
  syncRelayNote();
}

function renderDevices() {
  const q = el.devicesQ.value.trim().toLowerCase();
  const match = (d) =>
    !q || d.serial.toLowerCase().includes(q) || (d.model ?? "").toLowerCase().includes(q);
  const mode = el.devicesSort.value;

  const ownedAll = deviceList.filter((d) => d.ownership !== "shared");
  const sharedAll = deviceList.filter((d) => d.ownership === "shared");
  const owned = sortDevices(ownedAll.filter(match), mode);
  const shared = sortDevices(sharedAll.filter(match), mode);

  /* Owned — the main list. */
  el.devicesRows.innerHTML = deviceRowsHtml(owned);
  el.devicesEmpty.hidden = owned.length > 0 || devicesLoading;
  el.devicesEmpty.textContent = devicesLoading
    ? ""
    : devicesNote
      ? devicesNote
      : !devicesAsked
        ? "Press Get devices to list the headsets on this account."
        : ownedAll.length
          ? "Nothing matches."
          : "No devices found on this account.";
  el.devicesCount.textContent = devicesLoading
    ? "Asking the store…"
    : !devicesAsked || devicesNote
      ? ""
      : owned.length === ownedAll.length
        ? `${ownedAll.length} device${ownedAll.length === 1 ? "" : "s"}.`
        : `${owned.length} of ${ownedAll.length} devices.`;
  const presence = devicesLoading ? "" : presenceLine();
  el.devicesPresence.textContent = presence;
  el.devicesPresence.hidden = !presence;

  /* Shared — its own section, shown only when the account has shared devices. */
  el.sharedSection.hidden = !devicesAsked || devicesLoading || sharedAll.length === 0;
  el.sharedRows.innerHTML = deviceRowsHtml(shared, { testChannel: false });
  el.sharedCount.textContent =
    shared.length === sharedAll.length
      ? `${sharedAll.length} shared device${sharedAll.length === 1 ? "" : "s"}.`
      : `${shared.length} of ${sharedAll.length} shared devices.`;
}

/* ---------- settings ---------- */

/* One request, as a line in the log box. Newest at the bottom, capped so a long
   session cannot grow it without bound, and scrolled to keep the latest in view.
   The URL arrives with its token already stripped, in check.js. */
const LOG_MAX = 300;
function appendLog(d) {
  const line = document.createElement("div");
  const bad = Boolean(d.error) || d.status >= 400;
  line.className = bad ? "logline bad" : "logline";
  const time = new Date().toLocaleTimeString();
  const head = d.error ? `✗ ${d.error}` : `${d.status} · ${d.ms}ms`;
  line.textContent = `${time}  ${head}  ${d.url}`;
  el.logBox.append(line);
  while (el.logBox.children.length > LOG_MAX) el.logBox.firstChild.remove();
  el.logBox.scrollTop = el.logBox.scrollHeight;
}

function initSettings() {
  const saved = loadSettings();
  /* The built-in token is a default, not something the user typed — leave the
     box empty so it is obvious nothing personal is stored yet. */
  el.token.value = localStorage.getItem("metadb.token") ?? "";
  el.acToken.value = saved.acToken;
  el.relay.value = saved.relay;

  syncRelayNote();

  el.settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      saveSettings({
        token: el.token.value.trim(),
        acToken: el.acToken.value.trim(),
        relay: el.relay.value.trim(),
      });
      syncRelayNote();
      say("Saved.", "ok");
    } catch (err) {
      say(err.message, "bad");
    }
  });

  /* The Save at the bottom covers the whole form, but the tokens are far enough
     up the page that they deserve their own. */
  el.saveTokens.addEventListener("click", () => {
    const token = el.token.value.trim();
    const acToken = el.acToken.value.trim();

    try {
      saveSettings({ token, acToken });
      renderAll();
      tell(
        [
          token ? "Access token saved." : "Access token cleared — using the built-in one.",
          acToken ? "Account token saved." : "No account token, so downloads stay off.",
        ].join(" "),
        "ok"
      );
    } catch (err) {
      tell(err.message, "bad");
    }
  });

  for (const [node, key] of [
    [el.images, "images"],
    [el.details, "details"],
    [el.devDownloads, "devDownloads"],
    [el.binDownload, "binDownload"],
    [el.obb, "obb"],
    [el.wide, "wide"],
    [el.motion, "motion"],
  ]) {
    node.checked = saved[key];
    node.addEventListener("change", () => {
      saveSettings({ [key]: node.checked });
      /* Switching the mode off while a panel is filling the window would
         otherwise leave it there with no way back. */
      if (key === "wide" && !node.checked) closeStage();
      if (key === "binDownload") syncBinRow();
      renderAll();
    });
  }
  syncBinRow();

  /* This one defaults to on, so it stores "0"/"1" rather than a boolean —
     removing the key on false would read back as the default. */
  el.store.checked = saved.store;
  el.store.addEventListener("change", () => {
    saveSettings({ store: el.store.checked ? "1" : "0" });
    renderAll();
  });

  /* Turning it on fetches the library there and then, so the tint appears
     without waiting for the next reload; turning it off just drops the tint. */
  el.autoOwned.checked = saved.autoOwned;
  el.autoOwned.addEventListener("change", () => {
    saveSettings({ autoOwned: el.autoOwned.checked });
    if (el.autoOwned.checked && !mineAsked) loadEntitlements("quest");
    else renderAll();
  });

  /* The account lists an Entitlement tab shows, fetched on start rather than on
     a Get button. Switching one on fetches it there and then, if it has not
     been already; switching it off leaves what is loaded alone. */
  for (const [node, key, load, state] of [
    [el.autoDlc, "autoDlc", () => loadIaps(), iapState],
    [el.autoPlaytime, "autoPlaytime", () => loadPlaytime(), playState],
    [el.autoBackups, "autoBackups", () => loadBackups(), backupState],
  ]) {
    node.checked = saved[key];
    node.addEventListener("change", () => {
      saveSettings({ [key]: node.checked });
      if (node.checked && !state.asked) load();
    });
  }

  /* The request log. The box is only shown while logging is on; it keeps filling
     in the background either way, since check.js only emits when the setting is
     on. One listener, attached once. */
  el.log.checked = saved.log;
  el.logField.hidden = !saved.log;
  el.log.addEventListener("change", () => {
    saveSettings({ log: el.log.checked });
    el.logField.hidden = !el.log.checked;
  });
  el.logClear.addEventListener("click", () => {
    el.logBox.replaceChildren();
  });
  window.addEventListener("metadb:log", (e) => appendLog(e.detail));

  el.clearBtn.addEventListener("click", () => {
    clearSettings();
    el.token.value = "";
    el.acToken.value = "";
    tell("", "");
    el.relay.value = "";
    el.images.checked = false;
    el.details.checked = false;
    el.devDownloads.checked = false;
    el.autoOwned.checked = false;
    el.autoDlc.checked = false;
    el.autoPlaytime.checked = false;
    el.autoBackups.checked = false;
    el.binDownload.checked = false;
    syncBinRow();
    el.log.checked = false;
    el.logField.hidden = true;
    el.logBox.replaceChildren();
    el.store.checked = true;
    for (const box of el.cols.querySelectorAll("input")) box.checked = true;
    applyColumns();
    const fresh = loadSettings();
    el.defHmd.value = el.hmd.value = fresh.hmd;
    el.defSort.value = el.sort.value = fresh.searchSort;
    el.defBuildSort.value = fresh.buildSort;
    syncRelayNote();
    say("Cleared. Back to the built-in token and no relay.", "ok");
  });

  el.useLocal.addEventListener("click", () => {
    el.relay.value = "http://127.0.0.1:8788/?url={url}";
    saveSettings({ relay: el.relay.value });
    syncRelayNote();
    say("Set to the local relay. Start it with: node tools/relay.mjs", "ok");
  });

  el.testBtn.addEventListener("click", async () => {
    saveSettings({
      token: el.token.value.trim(),
      acToken: el.acToken.value.trim(),
      relay: el.relay.value.trim(),
    });
    el.testBtn.disabled = true;
    say("Testing…", "");

    try {
      /* Any app with an ID will do — whatever the search list has on hand. */
      const probe = listing.find((a) => a.id);
      if (!probe) throw new Error("no app to test with — search for one first");
      const latest = await checkApp(probe);
      syncRelayNote();
      say(`Works — ${probe.name} reports ${latest.version} on ${latest.channel}.`, "ok");
    } catch (err) {
      say(`Failed: ${err.message}`, "bad");
    }

    el.testBtn.disabled = false;
  });
}

/* ---------- defaults ---------- */

/* The three list pickers start wherever settings say. Each settings dropdown is
   filled from the same source as the control it governs, so they cannot drift
   apart. */
function initDefaults() {
  const saved = loadSettings();

  fillOptions(el.defHmd, HMD_TYPES.map(([v, label]) => [v, `${label} (${v})`]));
  fillOptions(el.defSort, [...el.sort.options].map((o) => [o.value, o.textContent]));
  fillOptions(
    el.defMineSort,
    [...el.mineSort.options].map((o) => [o.value, o.textContent])
  );
  fillOptions(el.defBuildSort, BUILD_SORT_LABELS);
  fillOptions(el.defTrigger, DEFAULT_APP_TRIGGERS);

  const pairs = [
    [el.defHmd, "hmd", saved.hmd, el.hmd],
    [el.defSort, "searchSort", saved.searchSort, el.sort],
    [el.defMineSort, "mineSort", saved.mineSort, el.mineSort],
    [el.defBuildSort, "buildSort", saved.buildSort, null],
    [el.defTrigger, "defaultTrigger", saved.defaultTrigger, el.defaultTrigger],
  ];

  for (const [picker, key, value, live] of pairs) {
    picker.value = value;
    if (live) live.value = value;

    picker.addEventListener("change", () => {
      saveSettings({ [key]: picker.value });
      /* Move the live control too, so the effect is visible immediately rather
         than only on the next visit. */
      if (live) {
        live.value = picker.value;
        live.dispatchEvent(new Event("change"));
      }
    });
  }
}

function fillOptions(select, entries) {
  select.replaceChildren(
    ...entries.map(([value, label]) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      return opt;
    })
  );
}

/* ---------- columns ---------- */

function initColumns() {
  const hidden = new Set(loadSettings().hidden);

  for (const [cls, label] of COLUMNS) {
    const wrap = document.createElement("label");
    wrap.className = "check";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = !hidden.has(cls);

    box.addEventListener("change", () => {
      box.checked ? hidden.delete(cls) : hidden.add(cls);
      saveSettings({ hidden: [...hidden] });
      applyColumns();
    });

    wrap.append(box, document.createTextNode(` ${label}`));
    el.cols.append(wrap);
  }

  applyColumns();
}

/** Hidden columns become a class on <body>, so the CSS does the rest. */
function applyColumns() {
  const hidden = new Set(loadSettings().hidden);
  for (const [cls] of COLUMNS) {
    document.body.classList.toggle(`hide-${cls}`, hidden.has(cls));
  }
}

/* The site may relay through its own /api, in which case there is nothing to
   set up and nothing to warn about. The banner appears only once that turns out
   not to exist here. */
function syncRelayNote() {
  el.relayNote.hidden = !needsRelay();
}

function say(text, kind) {
  report(el.settingsOut, text, kind);
}

/** Feedback for the token block, which has its own save. */
function tell(text, kind) {
  report(el.tokensOut, text, kind);
}

function report(node, text, kind) {
  node.textContent = text;
  node.className = `settings-out ${kind}`;
}

/* ---------- channels ---------- */

const channelsOf = (app) => app.channels ?? [];

/** The channel a row is summarised by: PRIMARY, else LIVE, else the first one. */
function primaryOf(app) {
  const list = channelsOf(app);
  return (
    list.find((c) => c.group === "PRIMARY") ??
    list.find((c) => c.name === "LIVE") ??
    list[0] ??
    null
  );
}

function channelNames(app) {
  const list = channelsOf(app);
  return list.length ? list.map((c) => c.name) : [NO_CHANNEL];
}

/** Build a channel dropdown from whatever names a list actually contains. */
function fillChannelFilter(select, list) {
  const names = new Set();
  for (const app of list) for (const n of channelNames(app)) names.add(n);

  const ordered = [...names].sort((a, b) => {
    if (a === NO_CHANNEL) return 1;
    if (b === NO_CHANNEL) return -1;
    if (a === "LIVE") return -1;
    if (b === "LIVE") return 1;
    return a.localeCompare(b);
  });

  for (const n of ordered) {
    const opt = document.createElement("option");
    opt.value = n;
    opt.textContent = n;
    select.append(opt);
  }
}

/* ---------- boot ---------- */

async function boot() {
  el.searchGo.addEventListener("click", runSearch);
  el.q.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
  /* Clearing the box empties the table rather than leaving stale results up. */
  el.q.addEventListener("input", () => {
    if (!el.q.value.trim()) runSearch();
  });
  el.hmd.addEventListener("change", () => {
    if (el.q.value.trim()) runSearch();
  });
  /* Sorting is local to what is already listed, so it never re-queries. */
  el.sort.addEventListener("change", renderAll);

  /* The result count is a preference, so it survives a reload. */
  const savedLimit = loadSettings().limit;
  if (savedLimit && [...el.limit.options].some((o) => o.value === savedLimit)) {
    el.limit.value = savedLimit;
  }

  el.limit.addEventListener("change", () => {
    saveSettings({ limit: el.limit.value });
    if (el.q.value.trim()) runSearch();
  });

  el.checkAll.addEventListener("click", () =>
    checkList(visible(), el.checkAll, "Check shown")
  );

  el.mineQ.addEventListener("input", renderAll);
  el.mineSort.addEventListener("change", renderAll);
  /* One button per library: Quest, PC and expired. */
  for (const b of el.libButtons) {
    b.addEventListener("click", () => loadEntitlements(b.dataset.lib));
  }

  runSearch();

  /* With the setting on, pull the library in the background so the tint is
     ready by the time a search returns. Its own errors stay on the mine tab. */
  if (loadSettings().autoOwned) loadEntitlements("quest");

  /* The same for the account lists behind an app's Entitlement tab. */
  const auto = loadSettings();
  if (auto.autoDlc) loadIaps();
  if (auto.autoPlaytime) loadPlaytime();
  if (auto.autoBackups) loadBackups();
}

/** Headset picker, showing the store's codename next to each name. */
function fillHmdPicker() {
  for (const [value, label] of HMD_TYPES) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = `${label} (${value})`;
    el.hmd.append(opt);
  }
}

/* ---------- your entitlements ---------- */

/** What the account owns, filtered and sorted like the other lists. */
function mineApps() {
  const q = el.mineQ.value.trim().toLowerCase();
  return sorted(
    mineList.filter((a) => matches(a, q)),
    el.mineSort.value
  );
}

/* The libraries, each with its own query, and the words the status line uses
   for it. */
const LIBRARIES = {
  quest: {
    label: "Quest",
    asking: "Asking the store what this account owns on Quest…",
    none: "This account owns nothing on Quest that the store will list.",
    noun: "Quest entitlement",
  },
  pc: {
    label: "PC",
    asking: "Asking the store what this account owns on PC…",
    none: "This account owns nothing on PC that the store will list.",
    noun: "PC entitlement",
  },
  expired: {
    label: "expired",
    asking: "Asking the store what this account used to own…",
    none: "Nothing on this account has expired.",
    noun: "expired entitlement",
  },
};

/**
 * Ask the store what this account owns on one of its stores.
 *
 * A library is one store's worth, so a load replaces the list rather than
 * adding to it — mixing the two would leave a count nobody could account for.
 *
 * Errors are kept rather than thrown at the console: an entitlements list is
 * the one screen where "nothing here" and "the store refused" look identical,
 * and the difference is usually a missing token.
 */
async function loadEntitlements(kind) {
  if (mineLoading) return;

  mineAsked = true;
  mineKind = kind;
  mineLoading = true;
  mineNote = "";
  /* Only one library loads at a time, so all three wait; the pressed one says so. */
  const labels = new Map([...el.libButtons].map((b) => [b, b.textContent]));
  for (const b of el.libButtons) {
    b.disabled = true;
    if (b.dataset.lib === kind) b.textContent = "Asking…";
  }
  renderAll();

  try {
    mineList = await myEntitlements(kind);
    /* The headset list may already be on screen, named only by package. */
    if (adbInstalled.length) resolveHeadsetApps();
  } catch (err) {
    mineList = [];
    mineNote = err.message;
  } finally {
    mineLoading = false;
    for (const [b, label] of labels) {
      b.disabled = false;
      b.textContent = label;
    }
    syncRelayNote();
    renderAll();
  }
}


function pageSize() {
  return el.limit.value === "all" ? Infinity : Number(el.limit.value);
}

/* ---------- searching ---------- */

function matches(app, q) {
  if (!q) return true;
  return (
    app.name.toLowerCase().includes(q) ||
    (app.id ?? "").includes(q) ||
    (app.packageName ?? "").toLowerCase().includes(q)
  );
}

const visible = () => sorted(listing, el.sort.value);

const PACKAGE_RE = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+){2,}$/i;

/**
 * One box, four kinds of input. An ID or a store link goes straight to that app,
 * a package name is resolved first, and anything else is a store search. An
 * empty box falls back to the saved catalog so the page is never blank.
 */
async function runSearch() {
  const raw = el.q.value.trim();

  if (!raw) {
    listing = [];
    listingNote = "";
    renderAll();
    return;
  }

  searching = true;
  el.searchGo.disabled = true;
  el.searchGo.textContent = "Searching…";
  listingNote = "";
  renderAll();

  try {
    const id = parseAppId(raw);

    /* Everything here comes from the store. The Meta apps screen has its own
       file and is deliberately not consulted, so a result on this screen is
       always what the store says right now. */
    if (id) {
      listing = [await lookupApp(id)];
      listingNote = "fetched by ID";
    } else if (PACKAGE_RE.test(raw)) {
      listing = [await lookupByPackage(raw)];
      listingNote = "resolved from package name";
    } else {
      listing = await searchStore(raw, {
        limit: pageSize(),
        hmdType: el.hmd.value,
      });
      listingNote = `store search on ${el.hmd.value}`;
    }
  } catch (err) {
    listing = [];
    listingNote = `search failed: ${err.message}`;
  }

  searching = false;
  el.searchGo.disabled = false;
  el.searchGo.textContent = "Search";
  renderAll();
}

const stateOf = (app) => results.get(keyOf(app))?.state ?? "unknown";

/* ---------- rendering ---------- */

let focusId = null;
let focusScope = null;

/* An app can be listed in both views, so open-state is keyed per table —
   expanding a row in one should not expand its twin in the other. */
const openKey = (scope, app) => `${scope}:${keyOf(app)}`;

function buildRows(tbody, list, scope) {
  /* An opened row is rebuilt too, so remember where each of its tables was
     scrolled to and put them back — otherwise pressing one Get button on the
     Entitlement tab sends the DLC or build list above it back to the top. */
  const scrolled = new Map();
  for (const d of tbody.querySelectorAll(":scope > tr.detail")) {
    const id = d.previousElementSibling?.dataset.id;
    if (id) scrolled.set(id, saveScrolls(d));
  }

  const out = [];
  for (const app of list) {
    out.push(appRow(app, scope));
    if (open.has(openKey(scope, app))) out.push(detailRow(app, undefined, scope));
  }
  tbody.replaceChildren(...out);

  for (const d of tbody.querySelectorAll(":scope > tr.detail")) {
    const saved = scrolled.get(d.previousElementSibling?.dataset.id);
    if (saved) restoreScrolls(d, saved);
  }
}

/* Each scrolling table in a panel, named by the tab it sits in and the heading
   above it — the name survives a rebuild where the element does not. */
function scrollKeys(root) {
  const seen = new Map();
  return [...root.querySelectorAll(".vscroll")].map((v) => {
    let h = v.previousElementSibling;
    while (h && h.tagName !== "H3") h = h.previousElementSibling;
    const base = `${v.closest("[data-pane]")?.dataset.pane ?? ""}|${h?.textContent ?? ""}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return [`${base}|${n}`, v];
  });
}

function saveScrolls(root) {
  const out = new Map();
  for (const [key, v] of scrollKeys(root)) if (v.scrollTop) out.set(key, v.scrollTop);
  return out;
}

function restoreScrolls(root, saved) {
  for (const [key, v] of scrollKeys(root)) if (saved.has(key)) v.scrollTop = saved.get(key);
}

function renderAll() {
  /* Only tint when the setting is on and there is a library to match against. */
  ownedKeys =
    loadSettings().autoOwned && mineKind !== "expired"
      ? new Set(mineList.map(keyOf))
      : new Set();

  const list = visible();

  const idle = !searching && !el.q.value.trim() && !listingNote;

  buildRows(el.rows, list, "main");
  el.empty.hidden = list.length > 0 || searching;
  el.empty.textContent = idle
    ? "Search the store to begin."
    : searching
      ? ""
      : "No apps matched.";

  el.count.textContent = searching
    ? "Asking the store…"
    : idle
      ? ""
      : `${list.length} app${list.length === 1 ? "" : "s"}` +
        (listingNote ? ` — ${listingNote}` : "");


  const mine = mineApps();
  buildRows(el.mineRows, mine, "mine");

  el.mineSub.textContent = mineStatus(mine.length);
  el.mineSub.classList.toggle("warn", Boolean(mineNote));
  el.mineEmpty.hidden = mine.length > 0 || mineLoading || Boolean(mineNote);
  el.mineEmpty.textContent = !mineAsked
    ? "Press Get Quest, Get PC or Get expired entitlements to list what this account owns."
    : mineList.length
      ? "Nothing matches."
      : LIBRARIES[mineKind].none;

  const orgShown = orgVisible();
  buildRows(el.orgRows, orgShown, "orgs");
  el.orgEmpty.hidden = orgShown.length > 0 || orgLoading;
  el.orgEmpty.textContent = orgLoading
    ? ""
    : orgNote
      ? orgNote
      : !orgAsked
        ? "Enter an organization ID above to list its apps."
        : orgList.length
          ? "Nothing matches."
          : "No apps for that organization.";
  el.orgCount.textContent = orgLoading
    ? "Asking the store…"
    : !orgAsked || orgNote
      ? ""
      : orgShown.length === orgList.length
        ? `${orgList.length} app${orgList.length === 1 ? "" : "s"}.`
        : `${orgShown.length} of ${orgList.length} apps.`;

  const defaultShown = defaultVisible();
  buildRows(el.defaultRows, defaultShown, "default");
  el.defaultEmpty.hidden = defaultShown.length > 0 || defaultLoading;
  el.defaultEmpty.textContent = defaultLoading
    ? ""
    : defaultNote
      ? defaultNote
      : !defaultAsked
        ? "Pick a headset and trigger, then press Get default apps."
        : defaultList.length
          ? "Nothing matches."
          : "No default apps for that headset and trigger.";
  el.defaultCount.textContent = defaultLoading
    ? "Asking the store…"
    : !defaultAsked || defaultNote
      ? ""
      : defaultShown.length === defaultList.length
        ? `${defaultList.length} app${defaultList.length === 1 ? "" : "s"}.`
        : `${defaultShown.length} of ${defaultList.length} apps.`;

  const plusShown = plusVisible();
  const plusAll = plusState.rows;
  buildRows(el.plusRows, plusShown, "plus");
  el.plusEmpty.hidden = plusShown.length > 0 || plusState.loading;
  el.plusEmpty.textContent = plusState.note
    ? plusState.note
    : !plusState.asked
      ? "Press Get Horizon+ games to list what the subscription offers right now."
      : plusAll.length
        ? "Nothing matches."
        : "The store lists no Horizon+ games for this account.";
  const monthly = plusAll.filter((a) => a.plus === "monthly").length;
  const claimed = plusAll.filter((a) => a.claimed).length;
  el.plusCount.textContent = plusState.loading
    ? "Asking the store…"
    : !plusAll.length
      ? ""
      : `${plusShown.length === plusAll.length ? plural(plusAll.length, "game") : `${plusShown.length} of ${plusAll.length} games`}` +
        ` — ${monthly} this month, ${plusAll.length - monthly} in the catalog; ${claimed} on this account.`;

  /* Opening a headset row calls this, not renderHeadset, so it redraws here. */
  buildAdbRows();

  if (focusId) {
    (focusScope ?? el.rows).querySelector(`tr.app[data-id="${focusId}"]`)?.focus();
    focusId = null;
    focusScope = null;
  }
}

/** The line under the Your entitlements heading: progress, refusal, or count. */
function mineStatus(shown) {
  if (mineLoading) {
    return LIBRARIES[mineKind].asking;
  }
  if (mineNote) return mineNote;
  if (!mineAsked) {
    return (
      "Everything on your account, from the same library queries a headset and " +
      "the desktop app run. Needs your own access token, set on the Settings page."
    );
  }
  const total = mineList.length;
  const word = `${LIBRARIES[mineKind].noun}${total === 1 ? "" : "s"}`;
  return shown === total
    ? `${total} ${word}.`
    : `${shown} of ${total} ${word}.`;
}

function appRow(app, scope) {
  const key = openKey(scope, app);

  /* Once a check has run, the row shows what the store is publishing rather than
     what was stored — otherwise a row flagged as out of date would keep showing
     the old version next to the notice saying so. */
  const found = results.get(keyOf(app))?.latest;
  const channels = found?.channels?.length ? found.channels : channelsOf(app);
  /* An entitlement arrives knowing the build the account may install, which is
     worth showing before anyone presses Check. A check still wins. */
  const primary = found ?? primaryOf(app) ?? app.latest ?? null;
  const extra = Math.max(0, channels.length - 1);
  const showArt = loadSettings().images;

  /* Flag rows for apps already on the account — but not in the library itself,
     where every row is owned and the tint would say nothing. */
  const isOwned = scope !== "mine" && ownedKeys.has(keyOf(app));

  const tr = document.createElement("tr");
  tr.className = isOwned ? "app owned" : "app";
  tr.dataset.id = keyOf(app);
  tr.tabIndex = 0;
  tr.setAttribute("aria-expanded", String(open.has(key)));
  tr.innerHTML = `
    <td class="name">${
      showArt && app.image
        ? `<img class="art" src="${esc(app.image)}" alt="" loading="lazy">`
        : ""
    }${esc(app.name)}</td>
    <td class="c-dev">${app.platform ? (DEVICE[app.platform] ?? app.platform) : "—"}</td>
    <td class="chan c-chan">${esc(
      primary?.name ??
        primary?.channel ??
        /* An entitlement says nothing about channels either way, so it gets a
           blank rather than being labelled as never released. */
        (app.owned ? "—" : NO_CHANNEL)
    )}${
      extra ? ` <span class="more-chan">+${extra}</span>` : ""
    }</td>
    <td class="num c-price">${app.price ? esc(app.price) : "—"}</td>
    <td class="num c-ver"><span class="clip" title="${esc(primary?.version ?? "")}">${esc(
      primary?.version ?? "—"
    )}</span></td>
    <td class="num c-build">${primary?.versionCode ?? "—"}</td>
    <td class="num c-date">${primary?.releasedAt ?? app.releasedAt ?? "—"}</td>
    ${app.owned ? ownedCells(app) : ""}
    ${devCell(app)}`;

  const toggle = (e) => {
    open.has(key) ? open.delete(key) : open.add(key);
    focusId = keyOf(app);
    focusScope = e.currentTarget.closest("tbody");
    renderAll();
  };

  tr.addEventListener("click", toggle);
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(e);
    }
  });

  return tr;
}

/** SHOUTY_CONSTANT -> "Shouty constant". */
const words = (s) =>
  String(s).toLowerCase().replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

/**
 * How the entitlement was come by.
 *
 * The store reports an ordinary purchase as UNKNOWN, which reads like a fault
 * rather than the commonest case there is, so it is named after where it came
 * from. The rest say what they mean once they are out of shouting case.
 */
const grantLabel = (grant) =>
  !grant || grant === "UNKNOWN" ? "Store" : words(grant);

/* The three columns only a library row has: when it was last opened, whether
   the entitlement is permanent or a lease, and where it came from. */
function ownedCells(app) {
  const played = app.lastUsed
    ? new Date(app.lastUsed * 1000).toISOString().slice(0, 10)
    : "—";

  return `
    <td class="num c-used">${played}</td>
    <td class="c-state">${esc(app.state ? words(app.state) : "—")}</td>
    <td class="c-grant">${esc(grantLabel(app.grant))}</td>
    <td class="num c-dlc">${esc(dlcCount(app))}</td>`;
}

/* The DLC column: how many purchases the account owns inside the app. */
function dlcCount(app) {
  if (mineKind !== "quest" || app.platform === "PC") return "—";
  /* Blank until Get DLC has been pressed in an opened app; nothing is fetched
     for the column on its own. */
  if (!iapState.asked) return "";
  if (iapState.loading) return "…";
  return String(iapState.byApp.get(app.id)?.length || "—");
}

/**
 * Whether an unreleased build sits ahead of everything on a channel.
 * Blank until the app has been checked — there is nothing to compare yet.
 */
function devCell(app) {
  const latest = results.get(keyOf(app))?.latest;
  if (!latest?.newest) return `<td class="num c-devb muted-cell">—</td>`;

  /* The bar is the newest build on any channel, not just LIVE — an internal
     channel still counts as released. Anything above that line has not been put
     on a channel at all, which is what makes it a dev build. */
  const channelTop = Math.max(
    Number(latest.versionCode) || 0,
    ...(latest.channels ?? []).map((c) => Number(c.versionCode) || 0)
  );

  const dev =
    Number(latest.newest.versionCode) > channelTop ? latest.newest : null;

  if (!dev) return `<td class="num c-devb muted-cell">no</td>`;

  /* Internal builds often reuse the public version string and differ only by
     build number, so showing the version again would look like a repeat. */
  const label =
    String(dev.version) === String(latest.version)
      ? `build ${dev.versionCode}`
      : dev.version;

  const title =
    `${dev.version} (build ${dev.versionCode}), uploaded ${dev.releasedAt ?? "?"}, ` +
    `on no channel`;

  return `<td class="num c-devb"><span class="clip dev-ahead" title="${esc(
    title
  )}">${esc(label)}</span></td>`;
}

/**
 * One app's panel, built the same either way.
 *
 * The row keeps its own copy and the expanded view builds another into the
 * overlay, so opening the big view takes nothing away from what is underneath
 * — which is what stopped it flickering as the row emptied itself.
 */
function appPanel(app, { staged = false, scope = null } = {}) {
  const found = results.get(keyOf(app));
  const list = found?.latest?.channels?.length
    ? found.latest.channels
    : channelsOf(app);

  /* Filled in by a check, alongside the build history. */
  const listed = (app.id && listings.get(app.id)) || null;
  const store = listed?.data ?? null;

  const L = found?.latest;

  const newest = L?.newest
    ? [
        ["Newest build", `${L.newest.version} (build ${L.newest.versionCode})`],
        [
          "Uploaded",
          `${L.newest.releasedAt} — ${
            L.newest.channels.length ? L.newest.channels.join(", ") : "no channel"
          }`,
        ],
      ]
    : [];

  const groups = [
    [
      "App",
      [
        ["App ID", app.id],
        /* The organization comes back with the store listing, so it fills in
           once the app has been checked. */
        ["Organization", store?.orgId],
        ["Package", app.packageName],
        ["Device", app.platform ? (DEVICE[app.platform] ?? app.platform) : null],
        ["Price", app.price],
      ],
    ],
    [
      "Builds",
      L
        ? [
            ["Latest release", `${L.version} (build ${L.versionCode})`],
            ["Released", `${L.releasedAt} on ${L.channel}`],
            ...newest,
            ["On record", L.total],
          ]
        : [],
    ],
    [
      "Listing",
      store
        ? [
            ["Category", store.category],
            ["Genres", commas(store.genres)],
            ["Game modes", commas(store.modes)],
            [
              "Rating",
              store.ratingCount
                ? `${store.rating} — ${store.ratingCount} ratings`
                : store.rating,
            ],
            ["On the store", store.released],
            ["In-app ads", store.hasAds ? "yes" : null],
          ]
        : [],
    ],
    [
      "Supports",
      store
        ? [
            ["Player modes", commas(store.playerModes)],
            ["Controllers", commas(store.controllers)],
            ["Platforms", commas(store.platforms)],
            ["Languages", commas(store.languages)],
            ["Internet", store.internet],
            ["Comfort", store.comfort],
          ]
        : [],
    ],
    [
      "Published by",
      store
        ? [
            ["Publisher", store.publisher],
            /* Only its own line when it is not just the publisher again. */
            ["Developer", store.developer === store.publisher ? null : store.developer],
            ["Installs at", store.installSize],
          ]
        : [],
    ],
  ];

  const opts = loadSettings();

  const storeLink =
    app.id && opts.store
      ? `<a href="https://www.meta.com/experiences/${app.id}/" target="_blank"
           rel="noopener">Open in store</a>`
      : "";

  const actions = app.id
    ? `<button type="button" data-check="1">Check this app</button>${
        /* Binary info reads Android builds only; a Rift app has nothing to show. */
        opts.details && app.platform !== "PC"
          ? `<button type="button" data-info="1">Latest Binary Info</button>`
          : ""
      }${
        /* Shown on every free app that carries an offer. The store refuses a
           claim on anything priced, so the button only appears where it can
           actually succeed — and not on the Entitlements screen, where every
           app is one the account already has. */
        app.free && app.offerId && scope !== "mine"
          ? `<button type="button" data-claim="1">Get entitlement</button>`
          : ""
      }${storeLink}`
    : `<button type="button" data-resolve="1">Find store ID</button>`;

  /* The channel this account is on, when a single check asked. Named by the
     account's own channel list, which can include one the history never
     shows (a private beta with no build of its own yet). */
  const mineCh = app.id ? myChannels.get(app.id) : null;
  const onChannel = mineCh?.current
    ? mineCh.channels.find((c) => c.id === mineCh.current)?.name ?? null
    : null;
  const onLine = onChannel
    ? `<p class="hint">This account is on <strong>${esc(onChannel)}</strong>.</p>`
    : "";

  const channelTable = list.length
    ? `<h3>Channels</h3>${onLine}
       <div class="vscroll short">
         <table class="vtable plain">
           <thead>
             <tr><th>Channel</th><th>Version</th><th>Build</th><th>Date</th></tr>
           </thead>
           <tbody>
             ${list
               .map(
                 (c) => `<tr>
                   <td>${esc(c.name)}</td>
                   <td>${esc(c.version ?? "—")}</td>
                   <td>${c.versionCode ?? "—"}</td>
                   <td>${c.releasedAt ?? "—"}</td>
                 </tr>`
               )
               .join("")}
           </tbody>
         </table>
       </div>`
    : `<p>${
        !app.id
          ? "No store ID to check against."
          : found
            ? "No published channel."
            : "Not checked yet — press Check this app for its channels and builds."
      }</p>`;

  /* Draft/in-review builds a developer has staged, when the token can see them.
     Its own short table under the channels, since it is the same kind of data
     — one row per revision — just from the submission side rather than live.
     Only in the staged view: it is developer-side detail, and a wide table in
     the inline row crowds the two halves out of their grid. It rides along on
     the build-history reply, so it is only here once a check has run. */
  const revs = staged ? L?.revisions ?? [] : [];
  const revisionTable = revs.length
    ? `<div class="revisions">
         <h3>Revisions</h3>
         <div class="vscroll short">
           <table class="vtable plain">
             <thead>
               <tr><th>Status</th><th>Created</th><th>Submissions</th><th>ID</th></tr>
             </thead>
             <tbody>
               ${revs
                 .map(
                   (r) => `<tr>
                     <td>${esc(r.status ?? "—")}</td>
                     <td>${esc(r.created ?? "—")}</td>
                     <td>${r.submissions}</td>
                     <td class="bid">${esc(r.id ?? "—")}</td>
                   </tr>`
                 )
                 .join("")}
             </tbody>
           </table>
         </div>
       </div>`
    : "";

  const panel = document.createElement("div");
  panel.className = "panel";

  /* Two halves either way. Stacked they read as one panel, as they always did;
     in the overlay they become the two columns — what the app is on the left,
     what the store holds for it on the right. */
  /* The panel's parts, grouped into Store, Builds and Entitlement tabs. Every
     app opens on Store, and comes back on whichever tab it was left on. */
  const tabKey = `${staged ? "stage" : scope}:${keyOf(app)}`;
  const tab = layoutState.panelTabs.get(tabKey) ?? "store";
  if (tab === "mine") setTimeout(() => wantYourCopy());

  const storeFacts = `${factGroups(groups)}${
    listed?.error ? `<p class="warn">No store listing: ${esc(listed.error)}</p>` : ""
  }`;
  const channelBlock = revisionTable
    ? `<div class="chan-rev"><div class="chans-col">${channelTable}</div>${revisionTable}</div>`
    : channelTable;
  const pane = (name) => `data-pane="${name}"${tab === name ? "" : " hidden"}`;
  const tabButton = (name, label) =>
    `<button type="button" class="companion-tab${tab === name ? " on" : ""}" data-panel-tab="${name}"
       role="tab" aria-selected="${tab === name}">${label}</button>`;

  /* The app's actions — check, manifest, claim, store link — sit under the
     tabs and serve Store and Builds alike. The Entitlement tab is about the
     account, not the app, so they step aside there. */
  const sharedActions = `<div data-app-actions${tab === "mine" ? " hidden" : ""}>
         ${actions ? `<div class="actions">${actions}</div>` : ""}
         <div class="claim-out"></div>
         <div class="resolve-out"></div>
         <div class="info-out"></div>
       </div>`;

  const main = `<div class="companion-tabs panel-tabs" role="tablist" aria-label="${esc(app.name)}">
         ${tabButton("store", "Store")}${tabButton("builds", "Builds")}${tabButton("mine", "Entitlement")}
       </div>
       ${sharedActions}
       <div ${pane("store")}>${storeFacts || "<p>Not checked yet — the listing arrives with Check this app.</p>"}</div>
       <div ${pane("builds")}>${channelBlock}<div class="versions-out"></div></div>
       <div ${pane("mine")}>${yourCopy(app)}</div>`;

  /* Which tab is showing, for the stylesheet: Latest Binary Info belongs to
     the Builds tab and steps aside on Store. */
  panel.dataset.tab = tab;

  panel.innerHTML = `
    ${
      opts.wide
        ? `<button type="button" class="stage-btn" data-stage>${
            staged ? "Close" : "Expand"
          }</button>`
        : ""
    }
    ${staged ? `<h3 class="stage-title">${esc(app.name)}</h3>` : ""}
    <div class="panel__side">
      ${
        /* Cover art is cover art wherever it appears: with app art turned off,
           no image is fetched from Meta's CDN here either — and the rest of the
           store's pictures are not offered, since fetching them is the whole
           point of the button. */
        staged && opts.images && (app.image || app.id)
          ? `<div class="artbox">
               ${app.image ? `<img class="panel__art" src="${esc(app.image)}" alt="">` : ""}
               ${
                 app.id
                   ? `<button type="button" data-images="1">Show more images</button>
                      <div class="images-out"></div>`
                   : ""
               }
             </div>`
          : ""
      }
      ${note(found)}
    </div>
    <div class="panel__main">
      ${main}
    </div>`;

  /* Switching tabs shows the other pane in place; the choice is kept so the
     panel comes back on it after a redraw. */
  for (const b of panel.querySelectorAll("[data-panel-tab]")) {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      const name = b.dataset.panelTab;
      layoutState.panelTabs.set(tabKey, name);
      for (const x of panel.querySelectorAll("[data-panel-tab]")) {
        const on = x === b;
        x.classList.toggle("on", on);
        x.setAttribute("aria-selected", String(on));
      }
      for (const p of panel.querySelectorAll("[data-pane]")) p.hidden = p.dataset.pane !== name;
      panel.dataset.tab = name;
      const shared = panel.querySelector("[data-app-actions]");
      if (shared) shared.hidden = name === "mine";
      if (name === "mine") wantYourCopy();
    });
  }

  /* The Entitlement tab's Get buttons. */
  for (const b of panel.querySelectorAll("[data-load]")) {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      b.disabled = true;
      b.textContent = "Loading…";
      loadForApp(app, b.dataset.load);
    });
  }

  panel.querySelector("[data-stage]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleStage(app, scope);
  });

  panel.querySelector("[data-check]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    checkOne(app, { channel: true });
  });

  panel.querySelector("[data-images]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    showImages(app, e.currentTarget, panel.querySelector(".images-out"));
  });

  panel.querySelector("[data-claim]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    claimOne(app, panel.querySelector(".claim-out"), e.currentTarget);
  });

  panel.querySelector("[data-resolve]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    resolveId(app, panel.querySelector(".resolve-out"), e.currentTarget);
  });


  const infoBtn = panel.querySelector("[data-info]");
  if (infoBtn) {
    const infoOut = panel.querySelector(".info-out");
    syncInfoButton(infoBtn, app);

    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleAppInfo(app, infoOut, infoBtn);
    });

    if (infoOpen.has(app.id) && infoCache.has(app.id)) {
      drawAppInfo(infoOut, infoCache.get(app.id));
    }
  }

  if (app.onHeadset) {
    panel.querySelector(".versions-out")?.addEventListener("click", (e) => {
      const button = e.target.closest("[data-install-build]");
      if (!button) return;
      e.stopPropagation();
      installBuild(app, button.dataset, button);
    });
  }

  /* Rift builds carry their download in JS rather than a plain link, so the
     store panels need a handler too — Quest APKs stay ordinary anchors. */
  if (isRift(app)) {
    panel.querySelector(".versions-out")?.addEventListener("click", (e) => {
      const button = e.target.closest("[data-rift-build]");
      if (!button) return;
      e.stopPropagation();
      downloadRiftBuild(app, button.dataset, button);
    });
  }

  /* Checking an app returns its whole build history, so the list appears on its
     own once a check has run — there is nothing separate to press. */
  if (versionCache.has(app.id)) {
    drawVersions(
      panel.querySelector(".versions-out"),
      versionCache.get(app.id),
      VERSION_PAGE,
      undefined,
      false,
      app
    );
  }

  return panel;
}

/** The expanded row under an app: its panel, in a cell wide enough to hold it. */
function detailRow(app, span, scope = null) {
  const tr = document.createElement("tr");
  tr.className = "detail";

  const td = document.createElement("td");
  td.colSpan = span ?? ROW_SPAN[scope] ?? (app.owned ? 11 : 8);
  td.append(appPanel(app, { scope }));

  tr.append(td);
  return tr;
}

/* ---------- binary manifest ---------- */

const infoCache = new Map();
const infoOpen = new Set();

function syncInfoButton(button, app) {
  button.textContent = infoOpen.has(app.id) ? "Hide Binary Info" : "Latest Binary Info";
}

/** Second press puts it away; the manifest is only ever fetched once. */
async function toggleAppInfo(app, out, button) {
  if (infoOpen.has(app.id)) {
    infoOpen.delete(app.id);
    out.innerHTML = "";
    syncInfoButton(button, app);
    return;
  }

  infoOpen.add(app.id);
  syncInfoButton(button, app);

  if (infoCache.has(app.id)) {
    drawAppInfo(out, infoCache.get(app.id));
    return;
  }

  button.disabled = true;
  out.innerHTML = `<p>Fetching the binary manifest…</p>`;

  try {
    const info = await appDetails(app.id);
    infoCache.set(app.id, info);
    drawAppInfo(out, info);
  } catch (err) {
    /* Left open so the reason stays on screen; Hide clears it. */
    out.innerHTML = `<p class="warn">Could not fetch: ${esc(err.message)}</p>`;
  }

  button.disabled = false;
}

/** Bytes as the store reports them, which are plain bytes. */
function mb(bytes) {
  if (!bytes) return null;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** A <dl> from [label, value] pairs, dropping the ones with nothing in them. */
function factList(pairs) {
  return `<dl>${pairs
    .filter(([, v]) => v)
    .map(([k, v]) => `<dt>${k}</dt><dd>${esc(String(v))}</dd>`)
    .join("")}</dl>`;
}

/**
 * A comma list that wraps between its items rather than through them.
 *
 * "Meta Quest 3S, Meta Quest 3, Meta Quest Pro" in a narrow column otherwise
 * breaks after "Meta Quest", which reads as a different headset. The spaces
 * inside each item are made non-breaking so only the commas are break points.
 */
const commas = (items) =>
  items.map((s) => String(s).replace(/ /g, " ")).join(", ");

/**
 * Facts as titled groups laid out beside each other.
 *
 * A flat list of twenty rows is a long scroll for what is really four short
 * lists. Groups that came back empty are dropped rather than left as a heading
 * with nothing under it.
 */
function factGroups(groups) {
  const filled = groups
    .map(([title, pairs]) => [title, pairs.filter(([, v]) => v)])
    .filter(([, pairs]) => pairs.length);

  if (!filled.length) return "";

  return `<div class="facts">${filled
    .map(
      ([title, pairs]) =>
        `<section><h4>${title}</h4>${factList(pairs)}</section>`
    )
    .join("")}</div>`;
}

function drawAppInfo(out, info, title = "Binary manifest") {
  out.innerHTML = `
    <h3>${esc(title)}</h3>
    ${factGroups([
      [
        "Binary",
        [
          ["Package", info.packageName],
          ["Version", info.version && `${info.version} (build ${info.versionCode})`],
          ["File", info.fileName],
          ["Uploaded", info.releasedAt],
        ],
      ],
      [
        "Size",
        [
          ["Download", mb(info.size)],
          ["Space needed", mb(info.requiredSpace)],
          ["OBB", mb(info.obbSize)],
        ],
      ],
      [
        "Needs",
        [
          ["Built for", info.targetSdk && `Android SDK ${info.targetSdk}`],
          ["OS", info.requiredOs],
          ["PSDK", info.requiredPsdk],
          ["Tracking", info.headTracking],
          [
            "External storage",
            info.externalStorage == null ? null : info.externalStorage ? "yes" : "no",
          ],
        ],
      ],
    ])}
    ${
      /* Hashes are 64 characters of hex — they get their own full-width block
         rather than squeezing a column to fit them. */
      info.sha256 || info.checksum || info.certSignature
        ? `<h4>Hashes</h4>${factList([
            ["SHA-256", info.sha256],
            ["MD5", info.checksum],
            ["Cert signature", info.certSignature],
          ])}`
        : ""
    }
    ${
      info.permissions.length
        ? `<h4>Permissions (${info.permissions.length})</h4>
           <ul class="perms">${info.permissions
             .map((p) => `<li>${esc(p)}</li>`)
             .join("")}</ul>`
        : ""
    }`;
}

/* ---------- version history ---------- */

const versionCache = new Map();
const VERSION_PAGE = 100;

/* An app can sit on a dozen channels; four lookups is enough to cover the ones
   anyone downloads from without turning one check into a dozen requests. */
const CHANNEL_LOOKUPS = 4;

/**
 * A build named the way the store names it: binary id, then build number.
 *
 * The id is what a download is addressed by and the build number is what the
 * rest of the page counts in, so the two belong together — "37348935798086923
 * (2811)". Either can be missing on old records, in which case the other is
 * shown on its own rather than beside a dash.
 */
function buildId(v) {
  if (v.id == null) return v.versionCode ?? "—";
  if (v.versionCode == null) return v.id;
  return `${v.id} (${v.versionCode})`;
}

/* ---------- download by binary ID ---------- */

/* The ID (build) column already prints the binary ID beside every version, so
   the shortest route to a single APK is to paste that number back in. Nothing
   is resolved here: a binary ID *is* the address the store's download endpoint
   takes, so this builds the same link the Download button does, addressed by
   hand rather than by row. Entitlement is still Meta's call, not ours. */
function initDirectDownload() {
  el.binGo.addEventListener("click", directDownload);
  el.binId.addEventListener("keydown", (e) => {
    if (e.key === "Enter") directDownload();
  });
  /* Typing again drops the last verdict rather than leaving a stale one sitting
     under a box whose contents have moved on. */
  el.binId.addEventListener("input", () => setBinNote(""));
}

function setBinNote(text, bad = false) {
  el.binNote.textContent = text;
  el.binNote.classList.toggle("bad", bad);
  el.binNote.hidden = !text;
}

/* Deliberately synchronous. A popup only counts as user-initiated while the
   click is still on the stack, so anything awaited here would hand the download
   to the popup blocker instead. */
function directDownload() {
  const id = el.binId.value.trim();

  if (!id) {
    setBinNote("Paste a binary ID first.", true);
    return;
  }

  /* Digits only, and long: a version code is four or five digits and would be
     accepted by a looser test, then 404 as a binary that does not exist. */
  if (!/^\d{8,}$/.test(id)) {
    setBinNote(
      "That is not a binary ID — copy the long number from a build's ID (build) column, not the version code in brackets.",
      true
    );
    return;
  }

  if (!canDownload()) {
    setBinNote(
      "Downloads sign with the account token — add your oc_ac_at on the Settings page first.",
      true
    );
    return;
  }

  window.open(downloadURL(id), "_blank", "noopener");
  setBinNote(
    `Asked the store for binary ${id}. It refuses anything the account is not entitled to.`
  );
}

/**
 * The download cell for one build.
 *
 * A build that reached a channel was published, so it is offered plainly. One
 * that never did is a different proposition: the store may well refuse it even
 * for an account that owns the app, so it is only offered when asked for, and
 * marked red to say it is not the same thing as the blue ones.
 *
 * Either way a download needs an account token to sign with, so without one
 * the button leads to Settings rather than a request that cannot work.
 *
 * A build with an expansion file gets a second link: the APK alone will install
 * and then sit there missing its assets, so the pair belongs together.
 */
/** A Rift (PC) app, whose builds come down as segments rather than one file. */
function isRift(app) {
  return app?.platform === "PC" || app?.platform === "RIFT";
}

/* fflate is vendored so the site stays self-contained; loaded on first use so
   a page that never touches a Rift download never pays for it. */
let _fflate;
async function loadFflate() {
  if (!_fflate) _fflate = await import("./vendor/fflate.module.js?v=149");
  return _fflate;
}

/**
 * Download a Rift build and hand it back as a .zip.
 *
 * The store gives a manifest and a segment base; the build is a tree of files,
 * each cut into fixed-size, content-addressed, zlib-compressed segments. This
 * fetches the manifest, then every file's segments in order, inflates them,
 * stitches each file whole and streams it into a zip. The whole archive is held
 * in memory before the browser saves it, so a very large build (tens of GB) can
 * outrun a tab — that is the trade for a single .zip and no folder picker.
 *
 * The button is the status line: it names each phase and re-enables when done,
 * per the build-row button convention. Errors land in its title.
 */
async function downloadRiftBuild(app, { riftBuild: binaryId, version }, button) {
  if (!canDownload()) {
    location.hash = "#settings";
    return;
  }

  const label = button.textContent;
  button.disabled = true;
  const say = (t) => {
    button.textContent = t;
    button.title = `${app.name}: ${t}`;
  };

  try {
    say("Finding build…");
    const { manifestUri, segmentsBaseUri, platform } = await riftMetadata(binaryId);
    if (platform === "ANDROID") {
      throw new Error("this is a Quest build, not a Rift one");
    }
    if (!manifestUri || !segmentsBaseUri) {
      throw new Error("no PC manifest for this build");
    }

    const f = await loadFflate();

    say("Fetching manifest…");
    const manifestZip = await riftManifestBytes(manifestUri);
    let manifestText;
    try {
      const entries = f.unzipSync(manifestZip, {
        filter: (e) => e.name === "manifest.json" || e.name.endsWith("/manifest.json"),
      });
      const key = Object.keys(entries)[0];
      if (!key) throw new Error("no manifest.json in the archive");
      manifestText = new TextDecoder().decode(entries[key]);
    } catch {
      /* Fallbacks in case the manifest is not a zip on some builds. */
      try {
        manifestText = new TextDecoder().decode(f.gunzipSync(manifestZip));
      } catch {
        manifestText = new TextDecoder().decode(manifestZip);
      }
    }

    const manifest = JSON.parse(manifestText);
    const files = manifest.files || {};
    const names = Object.keys(files);
    if (!names.length) throw new Error("the manifest listed no files");
    const totalBytes = names.reduce((sum, n) => sum + (files[n].size || 0), 0) || 1;

    const chunks = [];
    const zip = new f.Zip((err, data) => {
      if (data) chunks.push(data);
    });

    const inflate = (raw) => {
      try {
        return f.unzlibSync(raw);
      } catch {
        try {
          return f.gunzipSync(raw);
        } catch {
          return f.inflateSync(raw);
        }
      }
    };

    let doneBytes = 0;
    for (const name of names) {
      const file = files[name];
      const buf = new Uint8Array(file.size);
      let offset = 0;
      for (const seg of file.segments) {
        const sha = Array.isArray(seg) ? seg[1] : seg.sha256 ?? seg;
        const raw = await riftSegmentBytes(segmentsBaseUri, sha);
        buf.set(inflate(raw), offset);
        offset += file.segmentSize;
      }
      const entry = new f.ZipPassThrough(name);
      zip.add(entry);
      entry.push(buf, true);
      doneBytes += file.size;
      say(`Assembling… ${Math.round((doneBytes / totalBytes) * 100)}%`);
    }
    zip.end();

    say("Packaging…");
    const blob = new Blob(chunks, { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safe = (app.name || "rift-build").replace(/[^\w.-]+/g, "_");
    a.download = `${safe}_${version || binaryId}.zip`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);

    button.textContent = "Downloaded";
    button.title = `${app.name}: saved ${names.length} files as ${a.download}`;
  } catch (err) {
    button.textContent = "Failed";
    button.title = `${app.name}: ${err.message}`;
  } finally {
    button.disabled = false;
    setTimeout(() => {
      if (
        button.isConnected &&
        (button.textContent === "Downloaded" || button.textContent === "Failed")
      ) {
        button.textContent = label;
      }
    }, 6000);
  }
}

function downloadCell(v, offerDev, app = null) {
  if (!v.id) return "";

  const dev = !v.channels.length;
  if (dev && !offerDev) return "";

  /* On the headset tab the point of a build is to put it there, not to keep a
     copy — so the same row offers Install. The build already on the headset is
     named rather than offered again. */
  if (app?.onHeadset) {
    if (!canDownload()) {
      return `<a class="dl dl-off" href="#settings"
                title="Add your oc_ac_at account token in Settings">Install</a>`;
    }
    if (app.installedVersionCode && v.versionCode === app.installedVersionCode) {
      return `<span class="on-headset" title="This is what the headset is on">On headset</span>`;
    }
    const older =
      app.installedVersionCode && v.versionCode < app.installedVersionCode;
    return `<button type="button" class="dl${dev ? " dl-dev" : ""}"
              data-install-build="${esc(v.id)}"
              data-version="${esc(v.version)}"
              data-code="${v.versionCode ?? ""}"
              title="${esc(
                older
                  ? `Go back to ${v.version} — uninstalls first, losing this app's data`
                  : `Install ${v.version}`
              )}">Install</button>`;
  }

  /* Rift/PC builds are not a single file — the button assembles them from
     segments into a .zip in the browser, so it is a real control, not a link. */
  if (isRift(app)) {
    if (!canDownload()) {
      return `<a class="dl dl-off" href="#settings"
                title="Add your oc_ac_at account token in Settings">Download</a>`;
    }
    return `<button type="button" class="dl${dev ? " dl-dev" : ""}"
              data-rift-build="${esc(v.id)}"
              data-version="${esc(v.version)}"
              title="${esc(
                dev
                  ? `${v.version} — never released to a channel; assembled from PC segments as a .zip`
                  : `Download ${v.version} — assembled from PC segments into a .zip`
              )}">Download</button>`;
  }

  if (!canDownload()) {
    return `<a class="dl dl-off" href="#settings"
              title="Add your oc_ac_at account token in Settings">Download</a>`;
  }

  const obb = obbs.get(String(v.id));

  return `${
    obb
      ? `<a class="dl dl-obb" href="${esc(downloadURL(obb))}" target="_blank"
            rel="noopener" title="${esc(
              `Expansion file for ${v.version} — binary ${obb}`
            )}">OBB</a>`
      : ""
  }<a class="dl${dev ? " dl-dev" : ""}" href="${esc(downloadURL(v.id))}"
            target="_blank" rel="noopener" title="${esc(
              dev
                ? `${v.fileName || "download"} — never released to a channel`
                : v.fileName || "download"
            )}">Download</a>`;
}

/* Released first by default: most of a history is internal builds, and the
   handful that shipped are what anyone came to look at. */
function drawVersions(
  out,
  list,
  limit,
  mode = loadSettings().buildSort,
  keepScroll = false,
  app = null
) {
  if (!list.length) {
    out.innerHTML = `<p>No builds returned.</p>`;
    return;
  }

  /* Extending the list rebuilds the table, which would otherwise throw the
     reader back to the top of a few hundred rows they had scrolled through. */
  const wasAt = keepScroll ? (out.querySelector(".vscroll")?.scrollTop ?? 0) : 0;

  const ordered = [...list].sort(BUILD_SORTS[mode] ?? BUILD_SORTS.released);
  const page = ordered.slice(0, limit);
  const released = list.filter((v) => v.channels.length).length;
  const offerDev = loadSettings().devDownloads;

  out.innerHTML = `
    <h3>Build history</h3>
    <p class="hint">
      ${list.length} build${list.length === 1 ? "" : "s"}, ${released} of them attached to a
      channel. Showing ${page.length}. Builds that reached a channel can be pulled from
      the store${canDownload() ? " if your account is entitled to them" : ", once an oc_ac_at account token is set in Settings"}.
    </p>
    ${obbNote ? `<p class="warn">${esc(obbNote)}</p>` : ""}
    <div class="build-bar">
      <select class="build-sort" aria-label="Order builds">
        ${BUILD_SORT_LABELS.map(
          ([value, label]) =>
            `<option value="${value}"${value === mode ? " selected" : ""}>${label}</option>`
        ).join("")}
      </select>
    </div>
    <div class="vscroll">
      <table class="vtable">
        <thead>
          <tr><th>Version</th><th>ID (build)</th><th>Date</th><th>Channel</th><th></th></tr>
        </thead>
        <tbody>
          ${page
            .map(
              (v) => `<tr class="${[
                v.channels.length ? "on-channel" : "",
                app?.onHeadset && v.versionCode === app.installedVersionCode
                  ? "installed"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}">
                <td>${esc(v.version)}</td>
                <td class="bid">${buildId(v)}</td>
                <td>${v.releasedAt ?? "—"}</td>
                <td>${v.channels.length ? esc(v.channels.join(", ")) : "—"}</td>
                <td>${
                  app?.id && app.platform !== "PC" && v.versionCode != null
                    ? `<button type="button" class="build-btn" data-build="${esc(v.versionCode)}"
                         data-build-version="${esc(v.version)}" aria-expanded="false">Details</button>`
                    : ""
                }${downloadCell(v, offerDev, app)}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${
      list.length > page.length
        ? `<button type="button" class="more-versions">Show ${Math.min(
            VERSION_PAGE,
            list.length - page.length
          )} more</button>`
        : ""
    }`;

  const scroller = out.querySelector(".vscroll");
  if (scroller && wasAt) scroller.scrollTop = wasAt;

  /* Details on a build opens that build's own record under its row. The table
     is rebuilt on every draw, so the listener goes on this one's body. */
  out.querySelector("tbody")?.addEventListener("click", (e) => {
    const button = e.target.closest("[data-build]");
    if (!button || !app?.id) return;
    e.stopPropagation();
    toggleBuildDetails(app, button);
  });

  out.querySelector(".more-versions")?.addEventListener("click", (e) => {
    e.stopPropagation();
    drawVersions(out, list, limit + VERSION_PAGE, mode, true, app);
  });

  out.querySelector(".build-sort")?.addEventListener("change", (e) => {
    e.stopPropagation();
    /* Reordering starts the list again rather than keeping a page count that
       was counted against a different order, so the top is where to be. */
    drawVersions(out, list, VERSION_PAGE, e.target.value, false, app);
  });
}

/**
 * Open or close one build's details under its row in the build history.
 *
 * AppBinaryCombinedQuery describes one exact build by version code — size,
 * space, SDK, OBB, hashes, permissions — where Latest Binary Info only ever
 * describes the latest. Asked once per build and kept.
 */
async function toggleBuildDetails(app, button) {
  const row = button.closest("tr");
  const open = row.nextElementSibling?.classList.contains("build-detail");
  if (open) {
    row.nextElementSibling.remove();
    button.setAttribute("aria-expanded", "false");
    return;
  }

  const code = button.dataset.build;
  const key = `${app.id}:${code}`;
  const detail = document.createElement("tr");
  detail.className = "build-detail";
  detail.innerHTML = `<td colspan="${row.children.length}"><div class="panel build-out"></div></td>`;
  row.after(detail);
  button.setAttribute("aria-expanded", "true");
  const out = detail.querySelector(".build-out");
  const title = `Build ${button.dataset.buildVersion} (${code})`;

  if (buildInfo.has(key)) {
    drawAppInfo(out, buildInfo.get(key), title);
    return;
  }

  out.innerHTML = "<p>Asking the store about this build…</p>";
  button.disabled = true;
  button.textContent = "Loading…";
  try {
    const info = await binaryDetails(app.id, code);
    buildInfo.set(key, info);
    drawAppInfo(out, info, title);
  } catch (err) {
    out.innerHTML = `<p class="warn">Could not load this build: ${esc(err.message)}</p>`;
  } finally {
    button.disabled = false;
    button.textContent = "Details";
    syncRelayNote();
  }
}

/**
 * Claim a free app for the signed-in account.
 *
 * The one thing here that writes rather than reads, so it says plainly what it
 * did and leaves the answer on screen — including "you already own this",
 * which is the store's way of saying there was nothing to do.
 */
async function claimOne(app, out, button) {
  button.disabled = true;
  out.innerHTML = `<p>Asking the store for ${esc(app.name)}…</p>`;

  try {
    await claimOffer(app.offerId, el.hmd.value);
    out.innerHTML = `<p class="ok">${esc(app.name)} is on your account. It will
      show up under Your entitlements the next time you fetch them.</p>`;
  } catch (err) {
    out.innerHTML = `<p class="warn">Not claimed: ${esc(err.message)}</p>`;
  }

  button.disabled = false;
  syncRelayNote();
}

/**
 * System apps are listed by package name only. The store can map a package to
 * an ID, but the built-in public token is refused, so this needs a token with
 * more access set on the Settings page.
 */
async function resolveId(app, out, button) {
  button.disabled = true;
  out.innerHTML = `<p>Asking the store for ${esc(app.packageName)}…</p>`;

  try {
    const found = await lookupByPackage(app.packageName);
    Object.assign(app, found);
    out.innerHTML = `
      <p>Found <strong>${esc(found.id)}</strong>. Add it to
      <code>data/meta-apps.json</code> so it sticks:</p>
      <pre>${esc(JSON.stringify(app, null, 2))}</pre>`;
    renderAll();
  } catch (err) {
    out.innerHTML = `<p class="warn">Could not resolve: ${esc(err.message)}</p>`;
    button.disabled = false;
  }
}

/* With no status column, the expanded row is where a check reports itself. */
function note(found) {
  if (found?.state === "checking") return `<p>Asking the store…</p>`;
  if (found?.state === "error") return `<p class="warn">Check failed: ${esc(found.error)}</p>`;
  if (found?.state === "outdated" && found.was) {
    return `<p class="warn">Moved on since the stored record, which said ${esc(found.was)}.</p>`;
  }
  return "";
}

/* ---------- checking ---------- */

function refreshRow(app) {
  /* An app listed in both views has a row in each; update every one. The whole
     row is rebuilt, not just its status — a store result gains its version and
     build columns only once the check comes back. */
  for (const tr of document.querySelectorAll(`tr.app[data-id="${keyOf(app)}"]`)) {
    /* Rebuild each row in the scope it actually lives in. Getting this wrong is
       how a checked entitlement picked up the "owned" tint: refreshed as the
       main list, its row read as owned rather than as part of the library. */
    const tbody = tr.closest("tbody");
    const scope =
      tbody === el.adbRows
        ? "adb"
        : tbody === el.mineRows
          ? "mine"
          : tbody === el.orgRows
            ? "orgs"
            : tbody === el.defaultRows
              ? "default"
              : tbody === el.plusRows
                ? "plus"
                : "main";
    const next = tr.nextElementSibling;

    tr.replaceWith(scope === "adb" ? adbRow(app) : appRow(app, scope));
    if (next?.classList.contains("detail")) {
      next.replaceWith(detailRow(app, scope === "adb" ? 5 : undefined, scope));
    }
  }

  /* The overlay holds its own copy of the same panel, so it needs the news. */
  if (isStaged(app)) refreshStage();
}

async function checkOne(app, { listing: wantListing = true, channel = false } = {}) {
  const key = keyOf(app);

  if (!app.id) {
    results.set(key, { state: "noid" });
    refreshRow(app);
    return;
  }

  results.set(key, { state: "checking" });
  refreshRow(app);

  /* The store listing rides along with the check: one button, one wait, and
     what the store says about the app lands beside what it says about its
     builds. Separate queries, so the listing is allowed to fail on its own —
     a missing genre is no reason to lose the build history.

     The offer rides along too, but only for apps that did not come from a
     search — Meta apps and an organization's apps carry no offer of their own,
     so this is what lets their free ones show a Get-entitlement button. */
  const wantOffer = wantListing && !app.offerId;
  const [history, store, page, mine] = await Promise.allSettled([
    checkApp(app),
    wantListing ? storeListing(app.id, el.hmd.value) : Promise.resolve(null),
    wantOffer ? appPage(app.id, el.hmd.value) : Promise.resolve(null),
    /* Which channel this account is on. Only Check this app asks — Check
       shown runs this same function, and one more request per app in a sweep
       is not worth a line of text. */
    channel ? myReleaseChannels(app.id) : Promise.resolve(null),
  ]);

  if (mine.status === "fulfilled" && mine.value) myChannels.set(app.id, mine.value);

  /* An offer found this way fills the app in, so the panel condition (free with
     an offer) can light the button and the claim has something to run against.
     The same reply carries the app's artwork, so Show more images has it ready
     without a request of its own. */
  if (page.status === "fulfilled" && page.value) {
    if (page.value.offer) {
      app.offerId = page.value.offer.offerId;
      app.free = page.value.offer.free;
    }
    media.set(app.id, page.value.media);
  }

  /* Only record an outcome when one was asked for, so a sweep does not wipe a
     listing an earlier check already fetched. */
  if (wantListing) {
    listings.set(
      app.id,
      store.status === "fulfilled"
        ? { data: store.value }
        : { error: store.reason.message }
    );
  }

  if (history.status === "rejected") {
    results.set(key, { state: "error", error: history.reason.message });
  } else {
    const latest = history.value;

    /* The check reads the whole history, so hand the build list to the version
       viewer rather than making it fetch the same payload again. */
    if (latest.builds) versionCache.set(app.id, latest.builds);

    /* Nothing stored to compare against — a store result rather than a saved
       record — so report what it is instead of claiming it changed. */
    const primary = primaryOf(app);
    const state = !primary
      ? "info"
      : String(latest.version) !== String(primary.version) ||
          Number(latest.versionCode) !== Number(primary.versionCode)
        ? "outdated"
        : "current";

    results.set(key, {
      state,
      latest,
      was: primary ? `${primary.version} (build ${primary.versionCode})` : null,
    });

    if (loadSettings().obb) await findObbs(latest.channels);
  }

  refreshRow(app);
  syncRelayNote();
}

/**
 * Which of an app's builds ship an OBB, one request per channel.
 *
 * Only the release-channel query knows, and it takes a single channel, so an
 * app on four channels costs four requests — hence the setting. A channel that
 * refuses is skipped rather than failing the check around it: the build history
 * is the point, and a missing OBB link is a smaller loss than no history.
 */
async function findObbs(channels = []) {
  obbNote = "";

  const all = [...new Set(channels.map((c) => c.id).filter(Boolean))];
  /* Skip channels already looked up this session — their OBBs are in the map. */
  const ids = all.filter((id) => !obbChecked.has(id)).slice(0, CHANNEL_LOOKUPS);

  if (!ids.length) {
    /* No channel IDs at all is worth saying; every ID already looked up is not. */
    if (channels.length && !all.length) {
      obbNote = "No OBB lookup: the build history reported no channel IDs.";
    }
    return;
  }

  const replies = await Promise.allSettled(ids.map((id) => channelObbs(id)));
  ids.forEach((id, i) => {
    if (replies[i].status === "fulfilled") obbChecked.add(id);
  });
  for (const reply of replies) {
    if (reply.status !== "fulfilled") continue;
    for (const [binary, obb] of reply.value) obbs.set(binary, obb);
  }

  if (replies.every((r) => r.status === "rejected")) {
    obbNote = `No OBB lookup: ${replies[0].reason.message}`;
  }
}

async function checkList(list, button, label) {
  if (!list.length) return;

  el.checkAll.disabled = true;
  el.checkOrg.disabled = true;

  /* Mark the ones with no store ID up front rather than counting them. */
  const checkable = [];
  for (const app of list) {
    if (app.id) checkable.push(app);
    else await checkOne(app);
  }

  /* The store's version query takes one app per call — an array of IDs is
     rejected outright — so the only way to speed a long list up is to have
     several in flight at once. Kept modest so nobody's relay gets hammered. */
  const CONCURRENCY = 6;
  let cursor = 0;
  let done = 0;

  async function worker() {
    while (cursor < checkable.length) {
      const app = checkable[cursor++];
      /* Check shown runs the same full check as Check this app on every app —
         build history, OBB pairings, and the store listing (organization,
         genres, rating, …) — so nothing needs a second per-app check after. */
      await checkOne(app);
      done += 1;
      button.textContent = `Checking ${done} of ${checkable.length}…`;
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, checkable.length) }, worker)
  );

  button.textContent = label;
  el.checkAll.disabled = false;
  el.checkOrg.disabled = false;
}

/* ---------- util ---------- */

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/* Last of all, once every const above exists. boot() reaches `visible`,
   `LIBRARIES` and other declarations further down this file, so calling it up
   with the other init functions is a temporal-dead-zone error — it only ever
   worked because its first statement used to be an await, which let the rest of
   the module finish evaluating first. */
boot();

/* ---------- download by binary ID ---------- */

/* The box is a side door most people never need, so it only appears when
   switched on in Settings. Hiding it takes any note it left with it. */
function syncBinRow() {
  const on = loadSettings().binDownload;
  el.binRow.hidden = !on;
  if (!on) el.binNote.hidden = true;
}

/* ---------- guided tour ----------
   Runs once, the first time the Apps and games screen is shown, and again
   whenever Take the tour in the footer is pressed. It points at the real
   controls rather than describing them from a distance: a ring around each
   one, the rest of the page dimmed, and a card beside it. Skip, Done or
   Escape all count as finished. */

/* The first match that is actually on screen: each layout has its own
   navigation, and the ones not in use are there but hidden. */
function tourTarget(selector) {
  return [...document.querySelectorAll(selector)].find((e) => e.getClientRects().length) ?? null;
}

function tourSteps() {
  return [
    {
      target: ".topbar h1",
      title: "What this is",
      body:
        "MetaDB reads the Meta Quest store live: every release channel and every build an app " +
        "has had, including the ones that never shipped. Nothing is stored — each list is " +
        "fetched when you ask for it. Not affiliated with Meta.",
    },
    {
      target: '.nav a[data-view="settings"]',
      title: "Start with a token",
      body:
        "Search and most lists need your own access token: sign in at secure.oculus.com and " +
        "copy the oc_www_at cookie into Settings. Downloads also want oc_ac_at. Without one, " +
        "a built-in token reads public LIVE builds and nothing else.",
    },
    {
      target: "#q",
      title: "Search the store",
      body:
        "Type an app name, or paste an app ID, a meta.com store link or an Android package " +
        "name. It works out which one it is.",
    },
    {
      target: "#view-apps table",
      title: "Open an app",
      body:
        "Click a result, then press Check this app. It pulls the release channels and the " +
        "full build history in one go, and builds that reached a channel get a Download button.",
    },
    {
      target: ".nav",
      title: "The other screens",
      body:
        "Apps also holds the default apps, Horizon+, Horizon worlds and an organization's apps. " +
        "User has your headsets and what you own. Headsets has ADB and CompanionServer.",
    },
  ];
}

function initTour() {
  el.tourAgain.addEventListener("click", () => {
    if (location.hash && location.hash !== "#apps") {
      /* applyView runs on the hash change; start once the screen is in. */
      location.hash = "#apps";
      setTimeout(startTour, speed() + 50);
    } else {
      startTour();
    }
  });
}

/** First visit only. */
function maybeTour() {
  if (tour || loadSettings().tourDone) return;
  /* Let the screen finish arriving so the ring lands where things end up. */
  setTimeout(() => {
    if (!tour && !loadSettings().tourDone && !el.viewApps.hidden) startTour();
  }, speed() + 50);
}

function startTour() {
  if (tour) return;

  const ring = document.createElement("div");
  ring.className = "tour-ring";
  ring.setAttribute("aria-hidden", "true");

  const card = document.createElement("div");
  card.className = "tour-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-labelledby", "tourTitle");
  card.setAttribute("aria-describedby", "tourBody");
  card.innerHTML = `
    <p class="tour-count"></p>
    <h3 id="tourTitle" class="tour-title"></h3>
    <p id="tourBody" class="tour-body"></p>
    <div class="tour-actions">
      <button type="button" data-tour="skip">Skip</button>
      <span class="tour-gap"></span>
      <button type="button" data-tour="back">Back</button>
      <button type="button" data-tour="next">Next</button>
    </div>`;

  document.body.append(ring, card);

  /* Scroll and resize already arrive at most once a frame. */
  const onMove = () => placeTour();
  const onKey = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      endTour();
    }
  };

  tour = {
    steps: tourSteps(),
    index: 0,
    ring,
    card,
    onMove,
    onKey,
    returnFocus: document.activeElement,
  };

  card.addEventListener("click", (e) => {
    const action = e.target.closest("[data-tour]")?.dataset.tour;
    if (action === "skip") endTour();
    else if (action === "back") showStep(tour.index - 1);
    else if (action === "next") {
      if (tour.index === tour.steps.length - 1) endTour();
      else showStep(tour.index + 1);
    }
  });
  window.addEventListener("resize", onMove);
  window.addEventListener("scroll", onMove, { passive: true });
  document.addEventListener("keydown", onKey, true);

  showStep(0);
  /* Moving between steps may glide; the first placement should not. */
  if (animates()) requestAnimationFrame(() => tour?.ring.classList.add("tour-move"));
}

function showStep(index) {
  const { steps, card } = tour;
  tour.index = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[tour.index];
  const last = tour.index === steps.length - 1;

  card.querySelector(".tour-count").textContent = `${tour.index + 1} of ${steps.length}`;
  card.querySelector(".tour-title").textContent = step.title;
  card.querySelector(".tour-body").textContent = step.body;
  card.querySelector('[data-tour="back"]').disabled = tour.index === 0;
  card.querySelector('[data-tour="next"]').textContent = last ? "Done" : "Next";
  /* Skip means nothing on the last step, where Done already ends it. */
  card.querySelector('[data-tour="skip"]').hidden = last;

  const target = tourTarget(step.target);
  if (target && target.getClientRects().length) {
    target.scrollIntoView({ block: "center", behavior: animates() ? "smooth" : "auto" });
  }
  placeTour();
  card.querySelector('[data-tour="next"]').focus({ preventScroll: true });
}

/* Everything is position: fixed, so it is placed from the viewport rect and
   re-placed on scroll and resize. The card goes under its target when there is
   room, over it when there is not, and is kept 16px off every edge. */
function placeTour() {
  if (!tour) return;
  const { ring, card, steps, index } = tour;
  const target = tourTarget(steps[index].target);
  const gutter = 16;
  const gap = 12;
  const pad = 6;

  const cardW = card.offsetWidth;
  const cardH = card.offsetHeight;

  if (!target || !target.getClientRects().length) {
    /* Nothing to point at on this screen width — the card stands alone in the
       middle, and the whole page stays dimmed. */
    ring.classList.add("tour-ring--none");
    card.style.left = `${Math.max(gutter, (innerWidth - cardW) / 2)}px`;
    card.style.top = `${Math.max(gutter, (innerHeight - cardH) / 2)}px`;
    return;
  }
  ring.classList.remove("tour-ring--none");

  const r = target.getBoundingClientRect();
  ring.style.top = `${r.top - pad}px`;
  ring.style.left = `${r.left - pad}px`;
  ring.style.width = `${r.width + pad * 2}px`;
  ring.style.height = `${r.height + pad * 2}px`;

  let top = r.bottom + pad + gap;
  if (top + cardH > innerHeight - gutter) top = r.top - pad - gap - cardH;
  top = Math.max(gutter, Math.min(top, innerHeight - gutter - cardH));

  const left = Math.max(gutter, Math.min(r.left, innerWidth - gutter - cardW));

  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
}

/** Ends the tour, however it ended, and remembers that it has been seen. */
function endTour() {
  if (!tour) return;
  const { ring, card, onMove, onKey, returnFocus } = tour;
  tour = null;

  window.removeEventListener("resize", onMove);
  window.removeEventListener("scroll", onMove);
  document.removeEventListener("keydown", onKey, true);
  ring.remove();
  card.remove();

  try {
    saveSettings({ tourDone: true });
  } catch {}
  if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
}

/* ---------- the account: saved worlds, and what the Entitlement tab reads ----------
   Saved worlds is its own screen, built like Headsets: nothing is fetched
   until its button is pressed, and the filter and sort work on what came back.
   Playtime and cloud backups have no screen: an opened app's Entitlement tab
   fetches them, when asked, for every headset at once. */

function initAccountTabs() {
  el.worldLoad.addEventListener("click", loadWorlds);
  for (const [value, label] of WORLD_SHELVES) el.worldShelf.append(new Option(label, value));
  el.worldShelfGo.addEventListener("click", loadShelf);
  el.worldMore.addEventListener("click", () => browseMore(pagedWorlds()));
  el.worldTabs.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-world-tab]");
    if (tab) setWorldTab(tab.dataset.worldTab);
  });
  el.creatorFind.addEventListener("click", findCreator);
  el.creatorQ.addEventListener("keydown", (e) => {
    if (e.key === "Enter") findCreator();
  });
  el.creatorQ.addEventListener("input", () => setCreatorNote(""));
  el.creatorGo.addEventListener("click", loadCreatorWorlds);
  el.worldQ.addEventListener("input", renderWorlds);
  el.worldSort.addEventListener("change", renderWorlds);
  el.worldLookupGo.addEventListener("click", lookUpWorld);
  el.worldLookup.addEventListener("keydown", (e) => {
    if (e.key === "Enter") lookUpWorld();
  });
  el.worldLookup.addEventListener("input", () => setWorldNote(""));
  /* A world row opens to its details, like an app row. */
  el.worldRows.addEventListener("click", (e) => {
    if (e.target.closest("tr.detail")) return;
    const row = e.target.closest("tr[data-world]");
    if (row) toggleWorld(row.dataset.world);
  });
  el.worldRows.addEventListener("keydown", (e) => {
    const row = e.target.closest?.("tr[data-world]");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      toggleWorld(row.dataset.world);
    }
  });
  renderWorlds();
}

/** The headsets this account owns, fetching the list if it has not been yet. */
async function ownedHeadsets() {
  /* Also while a fetch is still out: the list is empty until it lands. */
  if (!devicesAsked || devicesNote || devicesLoading) await loadDevices();
  if (devicesNote) throw new Error(devicesNote);
  return deviceList.filter((d) => d.ownership !== "shared" && d.serial);
}

/* Whether the account owns an app comes from the Quest library, read once —
   the Entitlements screen's copy when that is the Quest library, otherwise a
   fetch of its own that leaves the screen alone. */
function appNames() {
  if (libraryNames) return Promise.resolve(libraryNames);
  /* Several lists can ask at once; they share the one fetch. */
  layoutState.names ??= (async () => {
    let list = mineKind === "quest" && mineList.length ? mineList : null;
    if (!list) {
      try {
        list = await myEntitlements("quest");
      } catch {
        list = [];
      }
    }
    libraryNames = new Map(list.map((a) => [a.id, a]));
    layoutState.names = null;
    return libraryNames;
  })();
  return layoutState.names;
}

/* A headset by its model, with the serial masked the way Headsets masks it —
   or in full once Show serials has been pressed there. */
function headsetLabel(serial) {
  const d = deviceList.find((x) => x.serial === serial);
  const model = d?.model ?? "Unknown headset";
  return `${model} (${showSerials ? serial : maskSerial(serial)})`;
}

function textMatch(q, ...fields) {
  return !q || fields.some((f) => String(f ?? "").toLowerCase().includes(q));
}

/** Seconds as hours and minutes. */
function playLength(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 1) return seconds > 0 ? "under a minute" : "none";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
}

/** Seconds since the epoch as a date, the way the rest of the site writes them. */
function isoDay(seconds) {
  return seconds ? new Date(seconds * 1000).toISOString().slice(0, 10) : "—";
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/* One fetch at a time per list: a second Get pressed on another app while the
   first is out joins it rather than starting another. */
function loadPlaytime() {
  playState.promise ??= fetchPlaytime().finally(() => (playState.promise = null));
  return playState.promise;
}

function loadBackups() {
  backupState.promise ??= fetchBackups().finally(() => (backupState.promise = null));
  return backupState.promise;
}

/* Redraws every opened panel, in the lists and in the overlay. */
function renderAccountTabs() {
  renderAll();
  refreshStage();
}

/* One request per headset. A headset the store refuses is skipped and
   counted, not fatal: the others' numbers are still worth having. */
async function fetchPlaytime() {
  Object.assign(playState, { asked: true, loading: true, note: "" });
  renderAccountTabs();

  const rows = [];
  let failed = 0;
  let serials = [];
  try {
    serials = (await ownedHeadsets()).map((d) => d.serial);
    await appNames();
    for (const serial of serials) {
      try {
        for (const r of await headsetPlaytime(serial)) rows.push({ ...r, serial });
      } catch (err) {
        failed++;
        if (failed === serials.length) throw err;
      }
    }
    if (failed) playState.note = `${plural(failed, "headset")} could not be read.`;
  } catch (err) {
    playState.note = err.message || "Could not load playtime.";
  } finally {
    playState.rows = rows;
    playState.loading = false;
    renderAccountTabs();
    syncRelayNote();
  }
}

/* One request covers every headset: the query takes a list of serials. */
async function fetchBackups() {
  Object.assign(backupState, { asked: true, loading: true, note: "" });
  renderAccountTabs();

  let rows = [];
  try {
    const serials = (await ownedHeadsets()).map((d) => d.serial);
    await appNames();
    rows = serials.length ? await cloudBackups(serials) : [];
  } catch (err) {
    backupState.note = err.message || "Could not load cloud backups.";
  } finally {
    backupState.rows = rows;
    backupState.loading = false;
    renderAccountTabs();
    syncRelayNote();
  }
}

/* The key a playtime or backup record belongs under — the same one keyOf gives
   the app it is about, so a record finds its app without a lookup table. */
function recordKey(r) {
  return r.appId ?? r.packageName ?? "?";
}

/**
 * One table in an opened app, in the same form as its Channels: a heading, a
 * line saying what it adds up to, and the rows. Or that it is waiting, that
 * the store refused, or that there is nothing — in that order.
 */
function accountTable({ title, state, what, none, rows, summary, head, cells, load }) {
  let body;
  /* With `load`, nothing is fetched until its button is pressed, and the
     button says it is working while it is. */
  if (load && !state.asked) body = `<button type="button" data-load="${load.key}">${load.label}</button>`;
  else if (load && state.loading) body = `<button type="button" disabled>Loading…</button>`;
  else if (state.loading || !state.asked) body = `<p>Asking the store for ${what}…</p>`;
  else if (state.note && !state.rows.length) body = `<p class="warn">${esc(state.note)}</p>`;
  else if (!rows.length) body = `<p>${none ?? `No ${what} for this app.`}</p>`;
  else
    body = `<p class="hint">${summary}</p>
      <div class="vscroll short">
        <table class="vtable plain">
          <thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((r) => `<tr>${cells(r)}</tr>`).join("")}</tbody>
        </table>
      </div>`;
  return `${title ? `<h3>${title}</h3>` : ""}${body}`;
}

/**
 * One app's playtime ("play") or cloud backups ("backup") as a table, for its
 * Entitlement tab. With `load`, nothing is fetched until its button is pressed.
 */
function accountSections(app, scope, { load = false } = {}) {
  const key = keyOf(app);

  if (scope === "backup") {
    const backs = backupState.rows
      .filter((r) => recordKey(r) === key)
      .sort((a, b) => (b.backedUpAt ?? 0) - (a.backedUpAt ?? 0));
    const size = backs.reduce((sum, r) => sum + r.size, 0);
    return accountTable({
      title: "Cloud backups",
      state: backupState,
      what: "cloud backups",
      rows: backs,
      load: load ? { key: "backup", label: "Get cloud backups" } : null,
      summary: `${plural(backs.length, "backup")}, ${esc(mb(size) ?? "0 MB")} in all, the latest ${esc(
        isoDay(backs[0]?.backedUpAt)
      )}.`,
      head: ["Headset", "Type", "Size", "Backed up"],
      cells: (r) =>
        `<td>${esc(r.serial ? headsetLabel(r.serial) : "—")}</td>` +
        `<td>${esc(r.type ? words(r.type) : "—")}</td>` +
        `<td>${esc(mb(r.size) ?? "—")}</td>` +
        `<td>${esc(isoDay(r.backedUpAt))}</td>`,
    });
  }

  const plays = playState.rows
    .filter((r) => recordKey(r) === key)
    .sort((a, b) => b.seconds - a.seconds);
  const played = plays.reduce((sum, r) => sum + r.seconds, 0);
  return accountTable({
    title: "Playtime by headset",
    state: playState,
    what: "playtime in the last 28 days",
    rows: plays,
    load: load ? { key: "play", label: "Get playtime" } : null,
    summary: played
      ? `${esc(playLength(played))} in the last 28 days, on ${plural(plays.length, "headset")}.`
      : `On ${plural(plays.length, "headset")}, but not played in the last 28 days.`,
    head: ["Headset", "Played, 28 days"],
    cells: (r) => `<td>${esc(headsetLabel(r.serial))}</td><td>${esc(playLength(r.seconds))}</td>`,
  });
}

/* ---------- DLC you own ---------- */

function loadIaps() {
  iapState.promise ??= fetchIaps().finally(() => (iapState.promise = null));
  return iapState.promise;
}

async function fetchIaps() {
  Object.assign(iapState, { asked: true, loading: true, note: "" });
  try {
    iapState.byApp = await ownedIaps();
    iapState.rows = [...iapState.byApp.values()].flat();
  } catch (err) {
    iapState.byApp = new Map();
    iapState.rows = [];
    iapState.note = err.message || "Could not load DLC.";
  } finally {
    iapState.loading = false;
    renderAll();
    refreshStage();
    syncRelayNote();
  }
}

/** The DLC you own in one app, once the account's purchases have been asked for. */
function dlcTable(app) {
  const items = [...(iapState.byApp.get(app.id) ?? [])].sort(
    (a, b) => (b.grantedAt ?? 0) - (a.grantedAt ?? 0)
  );
  return accountTable({
    title: "DLC you own",
    state: iapState,
    what: "DLC you own",
    rows: items,
    /* Fetched only when asked, like playtime and backups: one request covers
       every app, so a press here fills the DLC in everywhere. */
    load: { key: "dlc", label: "Get DLC" },
    summary: `${plural(items.length, "item")} on this account.`,
    head: ["Item", "Type", "Granted", "Expires", "State"],
    cells: (r) =>
      `<td>${esc(r.name)}</td>` +
      `<td>${esc(r.type ? words(r.type) : "—")}</td>` +
      `<td>${esc(isoDay(r.grantedAt))}</td>` +
      `<td>${esc(r.expiresAt ? isoDay(r.expiresAt) : "Never")}</td>` +
      `<td>${esc(r.state ? words(r.state) : "—")}</td>`,
  });
}

/* ---------- saved worlds ---------- */

async function loadWorlds() {
  if (worldState.loading) return;
  Object.assign(worldState, { asked: true, loading: true, note: "" });
  el.worldLoad.disabled = true;
  el.worldLoad.textContent = "Loading…";
  renderWorlds();

  try {
    const { count, worlds } = await savedWorlds();
    worldState.rows = worlds;
    worldState.count = count;
  } catch (err) {
    worldState.rows = [];
    worldState.count = 0;
    worldState.note = err.message || "Could not load saved worlds.";
  } finally {
    worldState.loading = false;
    el.worldLoad.disabled = false;
    el.worldLoad.textContent = "Get saved worlds";
    renderWorlds();
    syncRelayNote();
  }
}

/* ---------- worlds: four tabs, each with its own list ----------
   Top worlds and Creator are paged lists — fetched a page at a time, with
   Load more asking for the next. Look up collects worlds found by ID, Saved is
   the account's saved worlds. The table shows the list of the tab that is on. */

function setWorldTab(tab) {
  worldTab = tab;
  for (const b of el.worldTabs.querySelectorAll("[data-world-tab]")) {
    const on = b.dataset.worldTab === tab;
    b.classList.toggle("on", on);
    b.setAttribute("aria-selected", String(on));
  }
  for (const p of el.viewWorlds.querySelectorAll("[data-world-pane]")) {
    p.hidden = p.dataset.worldPane !== tab;
  }
  renderWorlds();
}

/** The paged list behind the tab that is on, if it has one. */
function pagedWorlds() {
  return worldTab === "top" ? shelfState : worldTab === "creator" ? creatorState : null;
}

/** Start a paged list: `fetchPage(cursor)` resolves to { worlds, cursor }. */
async function browseWorlds(state, label, fetchPage, button) {
  if (state.loading) return;
  Object.assign(state, { rows: [], cursor: null, label, fetchPage, asked: true, note: "" });
  await browseMore(state, button);
}

async function browseMore(state, button = el.worldMore) {
  if (!state || state.loading || !state.fetchPage) return;
  const label = button.textContent;
  state.loading = true;
  button.disabled = true;
  button.textContent = "Loading…";
  renderWorlds();
  try {
    const page = await state.fetchPage(state.cursor);
    const have = new Set(state.rows.map((w) => w.id));
    state.rows.push(...page.worlds.filter((w) => !have.has(w.id)));
    state.cursor = page.cursor;
  } catch (err) {
    state.note = err.message || "Could not load these worlds.";
  } finally {
    state.loading = false;
    button.disabled = false;
    button.textContent = label;
    renderWorlds();
    syncRelayNote();
  }
}

function loadShelf() {
  const [source, name] = WORLD_SHELVES.find(([s]) => s === el.worldShelf.value) ?? WORLD_SHELVES[0];
  browseWorlds(shelfState, name, (cursor) => worldShelf(source, cursor), el.worldShelfGo);
}

function setCreatorNote(text, bad = false) {
  el.creatorNote.textContent = text;
  el.creatorNote.classList.toggle("bad", bad);
  el.creatorNote.hidden = !text;
}

/* Find creator lists the matching accounts; Get their worlds lists the
   picked one's published worlds. */
async function findCreator() {
  const text = el.creatorQ.value.trim();
  if (!text) {
    setCreatorNote("Type a username or name first.", true);
    return;
  }
  el.creatorFind.disabled = true;
  el.creatorFind.textContent = "Searching…";
  setCreatorNote("");
  try {
    const people = await searchPeople(text);
    el.creatorPick.replaceChildren(
      ...people.map(
        (p) =>
          new Option(
            p.alias ? `@${p.alias}${p.name && p.name !== p.alias ? ` — ${p.name}` : ""}` : p.name || p.id,
            p.id
          )
      )
    );
    el.creatorPick.hidden = el.creatorGo.hidden = !people.length;
    if (!people.length) setCreatorNote(`No one matches "${text}".`, true);
  } catch (err) {
    setCreatorNote(err.message || "Could not search people.", true);
  } finally {
    el.creatorFind.disabled = false;
    el.creatorFind.textContent = "Find creator";
    syncRelayNote();
  }
}

function loadCreatorWorlds() {
  const opt = el.creatorPick.selectedOptions[0];
  if (!opt) return;
  const who = opt.textContent.split(" — ")[0];
  browseWorlds(creatorState, `By ${who}`, (cursor) => publishedWorlds(opt.value, cursor), el.creatorGo);
}

/* Function declarations, not consts: renderWorlds first runs during module
   setup, before a const down here would be initialised. */
function worldSorter(mode) {
  const most = (key) => (a, b) => (b[key] ?? -1) - (a[key] ?? -1);
  if (mode === "visits" || mode === "online" || mode === "likes") return most(mode);
  if (mode === "az") return (a, b) => a.name.localeCompare(b.name);
  if (mode === "za") return (a, b) => b.name.localeCompare(a.name);
  return null;
}

function bigNumber(n) {
  return n == null ? "—" : Number(n).toLocaleString();
}

/** Every world any tab holds, for finding one by ID wherever it came from. */
function anyWorld(id) {
  return [...worldLookups, ...shelfState.rows, ...creatorState.rows, ...worldState.rows].find((w) => w.id === id);
}

function renderWorlds() {
  const q = el.worldQ.value.trim().toLowerCase();
  const sort = worldSorter(el.worldSort.value);
  const paged = pagedWorlds();
  const all =
    worldTab === "lookup" ? worldLookups : worldTab === "saved" ? worldState.rows : paged.rows;
  const shown = all.filter((w) => textMatch(q, w.name, w.id));
  const rows = sort ? shown.sort(sort) : shown;

  const art = loadSettings().images;
  /* The rows are rebuilt from scratch — when a world's details land, say — so
     a focused row gets its focus back afterwards. */
  const focused = document.activeElement?.closest?.("#worldRows tr[data-world]")?.dataset.world;
  el.worldRows.innerHTML = rows
    .map(
      (w) => `<tr class="app" tabindex="0" data-world="${esc(w.id)}" aria-expanded="${worldOpen.has(w.id)}">
      <td class="name">${
        art && w.image ? `<img class="art" src="${esc(w.image)}" alt="" loading="lazy">` : ""
      }${esc(w.name)}</td>
      <td class="num">${esc(w.id)}</td>
      <td class="num">${bigNumber(w.visits)}</td>
      <td class="num">${bigNumber(w.online)}</td>
      <td class="num">${bigNumber(w.likes)}</td>
    </tr>${worldOpen.has(w.id) ? worldDetail(w) : ""}`
    )
    .join("");
  if (focused) el.worldRows.querySelector(`tr[data-world="${CSS.escape(focused)}"]`)?.focus();

  /* What the tab that is on says when its list is empty, and its count. */
  const state = worldTab === "saved" ? worldState : paged;
  const loading = state?.loading ?? false;
  const asked = worldTab === "lookup" ? worldLookups.length > 0 : state.asked;
  const prompt = {
    top: "Pick a list and press Get worlds.",
    creator: "Find a creator by username or name, pick them, then press Get their worlds.",
    lookup: "Paste a world ID or a horizon.meta.com world link and press Look up world.",
    saved: "Press Get saved worlds to list the worlds this account has saved.",
  }[worldTab];
  el.worldEmpty.hidden = rows.length > 0 || loading;
  el.worldEmpty.textContent = !asked
    ? prompt
    : all.length
      ? "Nothing matches."
      : state?.note || (worldTab === "saved" ? "This account has no saved worlds." : "No worlds here.");

  let line = "";
  if (all.length) {
    const noun = worldTab === "saved" ? "saved world" : "world";
    const counted = rows.length === all.length ? plural(all.length, noun) : `${rows.length} of ${plural(all.length, noun)}`;
    line = `${paged ? `${paged.label}: ` : ""}${counted}${paged?.cursor ? ", more to load" : ""}.`;
    if (worldTab === "saved" && worldState.count > all.length) line += ` The store reports ${worldState.count}.`;
    if (state?.note && paged) line += ` ${state.note}`;
  }
  el.worldCount.textContent = loading ? "Asking the store…" : line;

  el.worldMore.hidden = !paged?.cursor || paged.loading;
}

/* ---------- the search box in the bar ----------
   It is always there, whatever screen is showing. Enter runs the search where
   it is and brings the results up if they are not already on screen. */

function initSearchBar() {
  el.q.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !["", "#apps"].includes(location.hash)) location.hash = "#apps";
  });
}

/* ---------- an app's Entitlement tab ---------- */

/** Ownership, release channel, DLC, playtime and backups for one app, from the account's side. */
function yourCopy(app) {
  if (!app.id) return "<p>No store ID, so nothing on the account can be matched to it.</p>";
  const own = libraryNames?.get(app.id);
  const ownLine = !libraryNames
    ? "<p>Asking the store what this account owns…</p>"
    : own
      ? `<p class="hint">In your Quest library — ${esc(own.state ? words(own.state) : "owned")}, from ${esc(
          grantLabel(own.grant)
        )}${own.lastUsed ? `, last played ${esc(isoDay(own.lastUsed))}` : ""}.</p>`
      : `<p class="hint">Not in your Quest library.</p>`;

  return `<h3>Ownership</h3>${ownLine}${channelSection(app)}${
    app.platform === "PC" ? "" : dlcTable(app)
  }${accountSections(app, "play", { load: true })}${accountSections(app, "backup", { load: true })}`;
}

/* ReleaseChannelsQuery, from the account's side: the channel this account is on
   for the app, and every channel it can see — public ones, and any private
   beta it has been let into. */
function channelSection(app) {
  const mine = myChannels.get(app.id);
  const failed = layoutState.channelErrors.get(app.id);
  let body;
  if (failed) body = `<p class="warn">${esc(failed)}</p>`;
  else if (!mine && layoutState.channelAsked.has(app.id)) body = `<button type="button" disabled>Loading…</button>`;
  else if (!mine) body = `<button type="button" data-load="channels">Get release channels</button>`;
  else if (mine.none) body = "<p>Needs your own access token, set in Settings.</p>";
  else if (!mine.channels.length) body = "<p>The store lists no release channels for this account.</p>";
  else {
    const on = mine.channels.find((c) => c.id === mine.current);
    body = `<p class="hint">${
      on ? `This account is on <strong>${esc(on.name)}</strong>.` : "This account is on none of them."
    } ${plural(mine.channels.length, "channel")} it can see.</p>
      <div class="vscroll short">
        <table class="vtable plain">
          <thead><tr><th>Channel</th><th>Version</th><th>Build</th><th>Open to</th><th></th></tr></thead>
          <tbody>${mine.channels
            .map(
              (c) => `<tr>
                <td>${esc(c.name)}</td>
                <td>${esc(c.version ?? "—")}</td>
                <td>${c.versionCode ?? "—"}</td>
                <td>${c.public ? "Everyone" : "Invited"}</td>
                <td>${c.id === mine.current ? "You're on this" : ""}</td>
              </tr>`
            )
            .join("")}</tbody>
        </table>
      </div>`;
  }
  return `<h3>Release channels</h3>${body}`;
}

/* The Entitlement tab reads one thing on its own when first opened — whether
   the account owns the app, one request. The rest wait for their buttons:
   release channels, DLC, playtime (one request per headset) and cloud
   backups. */
function wantYourCopy() {
  if (!libraryNames) appNames().then(() => renderAccountTabs());
}

/** A Get button on the Entitlement tab: fetch that one list. */
function loadForApp(app, what) {
  if (what === "dlc") return loadIaps();
  if (what === "play") return loadPlaytime();
  if (what === "backup") return loadBackups();
  if (what === "channels" && app?.id && !layoutState.channelAsked.has(app.id)) {
    layoutState.channelAsked.add(app.id);
    layoutState.channelErrors.delete(app.id);
    renderAccountTabs();
    myReleaseChannels(app.id)
      .then((found) => myChannels.set(app.id, found ?? { none: true, current: null, channels: [] }))
      .catch((err) => layoutState.channelErrors.set(app.id, err.message || "Could not load release channels."))
      .finally(() => renderAccountTabs());
  }
}

/* ---------- a saved world's details ---------- */

function toggleWorld(id) {
  if (worldOpen.has(id)) worldOpen.delete(id);
  else {
    worldOpen.add(id);
    if (!worldInfo.has(id)) loadWorld(id);
    loadWorldFlags(id);
  }
  renderWorlds();
  el.worldRows.querySelector(`tr[data-world="${CSS.escape(id)}"]`)?.focus();
}

async function loadWorld(id) {
  const world = anyWorld(id);
  if (!world) return;
  worldInfo.set(id, { loading: true, data: null, note: "" });
  try {
    worldInfo.set(id, { loading: false, data: await worldDetails(world), note: "" });
  } catch (err) {
    worldInfo.set(id, { loading: false, data: null, note: err.message || "Could not load this world." });
  } finally {
    renderWorlds();
    syncRelayNote();
  }
}

/* Beta and cloud streaming: two small reads, once per world, the first time it
   opens. A world the store says nothing about just shows neither line. */
async function loadWorldFlags(id) {
  if (worldFlagInfo.has(id)) return;
  worldFlagInfo.set(id, "loading");
  try {
    worldFlagInfo.set(id, await worldFlags(id));
  } catch {
    worldFlagInfo.set(id, { beta: null, streamable: null });
  }
  renderWorlds();
}

const yesNo = (v) => (v == null ? null : v ? "Yes" : "No");

/** An opened world: where it lives, when you were there, and its pictures. */
function worldDetail(w) {
  const info = worldInfo.get(w.id);
  const flags = worldFlagInfo.get(w.id);
  let body;
  if (!info || info.loading) body = "<p>Asking the store about this world…</p>";
  else if (info.note) body = `<p class="warn">${esc(info.note)}</p>`;
  else {
    const d = info.data;
    const pictures = loadSettings().images
      ? d.images.length
        ? `<h3>Pictures</h3><div class="world-pics">${d.images
            .map(
              (i) => `<figure><img src="${esc(i.uri)}" alt="${esc(`${w.name}: ${i.label}`)}" loading="lazy">
                 <figcaption>${esc(i.label)}</figcaption></figure>`
            )
            .join("")}</div>`
        : ""
      : d.images.length
        ? `<p class="hint">${plural(d.images.length, "picture")} — switch on Show app art in search results, in Settings, to see them.</p>`
        : "";
    body = `${factGroups([
      [
        "World",
        [
          ["World ID", w.id],
          ["Destination ID", d.destinationId],
          ["Last visited", d.lastVisit ? isoDay(d.lastVisit) : d.destinationId ? "Not recorded" : null],
          ["Opens in", d.apps.join(", ")],
          ["Beta", flags === "loading" ? "Asking…" : yesNo(flags?.beta)],
          ["Cloud streaming", flags === "loading" ? "Asking…" : yesNo(flags?.streamable)],
        ],
      ],
    ])}${
      d.launchLink ? `<h3>Launch link</h3><p class="world-link">${esc(d.launchLink)}</p>` : ""
    }${pictures}`;
  }
  return `<tr class="detail"><td colspan="5"><div class="panel">${body}</div></td></tr>`;
}

/* ---------- looking a world up ---------- */

function setWorldNote(text, bad = false) {
  el.worldLookupNote.textContent = text;
  el.worldLookupNote.classList.toggle("bad", bad);
  el.worldLookupNote.hidden = !text;
}

/**
 * Look a world up by its ID or link and open it at the top of the list. A world
 * already listed — saved, or looked up before — is simply opened.
 */
async function lookUpWorld() {
  const id = parseWorldId(el.worldLookup.value);
  if (!id) {
    setWorldNote("That is not a world ID — paste the long number, or a horizon.meta.com world link.", true);
    return;
  }
  setWorldNote("");

  /* A world another tab already holds needs no request — it just joins the
     Look up list. */
  const known = anyWorld(id);
  if (known) worldLookups = [known, ...worldLookups.filter((w) => w.id !== id)];
  else {
    el.worldLookupGo.disabled = true;
    el.worldLookupGo.textContent = "Looking up…";
    try {
      const world = await lookupWorld(id);
      worldLookups = [world, ...worldLookups.filter((w) => w.id !== world.id)];
    } catch (err) {
      setWorldNote(`Not found: ${err.message}`, true);
      return;
    } finally {
      el.worldLookupGo.disabled = false;
      el.worldLookupGo.textContent = "Look up world";
      syncRelayNote();
    }
  }

  worldOpen.add(id);
  if (!worldInfo.has(id)) loadWorld(id);
  loadWorldFlags(id);
  renderWorlds();
  el.worldRows.querySelector(`tr[data-world="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "nearest" });
}
