import {
  checkApp,
  lookupApp,
  lookupByPackage,
  appDetails,
  storeListing,
  downloadURL,
  canDownload,
  searchStore,
  HMD_TYPES,
  parseAppId,
  loadSettings,
  saveSettings,
  clearSettings,
  needsRelay,
} from "./check.js?v=16";

const DEVICE = { ANDROID_6DOF: "Quest", ANDROID_3DOF: "Go", PC: "Rift" };

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
  ["c-devb", "Dev build"],
];

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

const SORTS = {
  az: (a, b) => a.name.localeCompare(b.name),
  za: (a, b) => b.name.localeCompare(a.name),
  newest: nullsLast(blankToNull(dateOf), 1, (x, y) => y.localeCompare(x)),
  oldest: nullsLast(blankToNull(dateOf), -1, (x, y) => y.localeCompare(x)),
  priceUp: nullsLast(priceOf, 1, (x, y) => x - y),
  priceDown: nullsLast(priceOf, -1, (x, y) => x - y),
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
  metaQ: document.getElementById("metaQ"),
  metaSort: document.getElementById("metaSort"),
  metaChannel: document.getElementById("metaChannel"),
  checkAll: document.getElementById("checkAll"),
  limit: document.getElementById("limit"),
  limitbar: document.querySelector(".limitbar"),

  viewApps: document.getElementById("view-apps"),
  viewMeta: document.getElementById("view-meta"),
  viewSettings: document.getElementById("view-settings"),

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
  store: document.getElementById("store"),
  cols: document.getElementById("cols"),
  defHmd: document.getElementById("defHmd"),
  defSort: document.getElementById("defSort"),
  defBuildSort: document.getElementById("defBuildSort"),
  useLocal: document.getElementById("useLocal"),
  relayNote: document.getElementById("relayNote"),

  metaRows: document.getElementById("metaRows"),
  metaSub: document.getElementById("metaSub"),
  metaEmpty: document.getElementById("metaEmpty"),
  checkMeta: document.getElementById("checkMeta"),

  theme: document.getElementById("theme"),
  navLinks: document.querySelectorAll(".nav a"),
};

/** id -> { state, latest, error } */
const results = new Map();

/** id -> the store's own listing, filled in by a check. */
const listings = new Map();
const open = new Set();

let metaList = [];

/** What the Apps and games table is currently showing. */
let listing = [];
let listingNote = "";
let searching = false;

initTheme();
initViews();
initSettings();
initColumns();
/* The headset list has to exist before the defaults can select within it. */
fillHmdPicker();
initDefaults();
boot();

/* ---------- theme ---------- */

function initTheme() {
  syncThemeButton();
  el.theme.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    syncThemeButton();
  });
}

function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === "dark";
  el.theme.textContent = dark ? "Light" : "Dark";
  el.theme.setAttribute("aria-pressed", String(dark));
  el.theme.title = dark ? "Switch to light mode" : "Switch to dark mode";
}

/* ---------- views ---------- */

function initViews() {
  window.addEventListener("hashchange", applyView);
  applyView();
}

function applyView() {
  const hash = location.hash.replace("#", "");
  const view = ["meta", "settings"].includes(hash) ? hash : "apps";

  el.viewApps.hidden = view !== "apps";
  el.viewMeta.hidden = view !== "meta";
  el.viewSettings.hidden = view !== "settings";

  /* the limit only governs the apps list, so hide it elsewhere */
  el.limitbar.hidden = view !== "apps";

  for (const a of el.navLinks) a.classList.toggle("on", a.dataset.view === view);
  window.scrollTo(0, 0);
}

/* ---------- settings ---------- */

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
  ]) {
    node.checked = saved[key];
    node.addEventListener("change", () => {
      saveSettings({ [key]: node.checked });
      renderAll();
    });
  }

  /* This one defaults to on, so it stores "0"/"1" rather than a boolean —
     removing the key on false would read back as the default. */
  el.store.checked = saved.store;
  el.store.addEventListener("change", () => {
    saveSettings({ store: el.store.checked ? "1" : "0" });
    renderAll();
  });

  el.clearBtn.addEventListener("click", () => {
    clearSettings();
    el.token.value = "";
    el.acToken.value = "";
    tell("", "");
    el.relay.value = "";
    el.images.checked = false;
    el.details.checked = false;
    el.devDownloads.checked = false;
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
      /* Any app with an ID will do; the Meta list is the one always on hand. */
      const probe = metaList.find((a) => a.id) ?? listing.find((a) => a.id);
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
  fillOptions(el.defBuildSort, BUILD_SORT_LABELS);

  const pairs = [
    [el.defHmd, "hmd", saved.hmd, el.hmd],
    [el.defSort, "searchSort", saved.searchSort, el.sort],
    [el.defBuildSort, "buildSort", saved.buildSort, null],
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
  /* Meta apps live in their own file; a missing one just empties that screen. */
  try {
    const res = await fetch("data/meta-apps.json");
    if (res.ok) metaList = (await res.json()).apps ?? [];
  } catch {
    metaList = [];
  }

  fillChannelFilter(el.metaChannel, metaList);

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

  el.metaQ.addEventListener("input", renderAll);
  el.metaSort.addEventListener("change", renderAll);
  el.metaChannel.addEventListener("change", renderAll);

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
  el.checkMeta.addEventListener("click", () =>
    checkList(metaApps(), el.checkMeta, "Check shown")
  );

  runSearch();
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

/** Apps published by Meta — whatever is in data/meta-apps.json. */
function metaApps() {
  const q = el.metaQ.value.trim().toLowerCase();
  const chan = el.metaChannel.value;

  const list = metaList.filter((a) => {
    if (chan && !channelNames(a).includes(chan)) return false;
    return matches(a, q);
  });

  return sorted(list, el.metaSort.value);
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
  const out = [];
  for (const app of list) {
    out.push(appRow(app, scope));
    if (open.has(openKey(scope, app))) out.push(detailRow(app));
  }
  tbody.replaceChildren(...out);
}

function renderAll() {
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

  const meta = metaApps();
  buildRows(el.metaRows, meta, "meta");
  el.metaEmpty.hidden = meta.length > 0;
  el.metaEmpty.textContent = metaList.length
    ? "Nothing matches."
    : "data/meta-apps.json has no apps in it.";
  el.metaSub.textContent =
    meta.length === metaList.length
      ? `${metaList.length} app${metaList.length === 1 ? "" : "s"} published by Meta.`
      : `${meta.length} of ${metaList.length} apps published by Meta.`;

  if (focusId) {
    (focusScope ?? el.rows).querySelector(`tr.app[data-id="${focusId}"]`)?.focus();
    focusId = null;
    focusScope = null;
  }
}

function appRow(app, scope) {
  const key = openKey(scope, app);

  /* Once a check has run, the row shows what the store is publishing rather than
     what was stored — otherwise a row flagged as out of date would keep showing
     the old version next to the notice saying so. */
  const found = results.get(keyOf(app))?.latest;
  const channels = found?.channels?.length ? found.channels : channelsOf(app);
  const primary = found ?? primaryOf(app);
  const extra = Math.max(0, channels.length - 1);
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
    <td class="c-dev">${app.platform ? (DEVICE[app.platform] ?? app.platform) : "—"}</td>
    <td class="chan c-chan">${esc(primary?.name ?? primary?.channel ?? NO_CHANNEL)}${
      extra ? ` <span class="more-chan">+${extra}</span>` : ""
    }</td>
    <td class="num c-price">${app.price ? esc(app.price) : "—"}</td>
    <td class="num c-ver"><span class="clip" title="${esc(primary?.version ?? "")}">${esc(
      primary?.version ?? "—"
    )}</span></td>
    <td class="num c-build">${primary?.versionCode ?? "—"}</td>
    <td class="num c-date">${primary?.releasedAt ?? app.releasedAt ?? "—"}</td>
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

function detailRow(app) {
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

  const actions = app.id
    ? `<button type="button" data-check="1">Check this app</button>${
        opts.details
          ? `<button type="button" data-info="1">More app info</button>`
          : ""
      }${
        opts.store
          ? `<a href="https://www.meta.com/experiences/${app.id}/" target="_blank"
               rel="noopener">Open in store</a>`
          : ""
      }`
    : `<button type="button" data-resolve="1">Find store ID</button>`;

  const channelTable = list.length
    ? `<h3>Channels</h3>
       <table class="chans">
         <thead><tr><th>Channel</th><th>Version</th><th>Build</th><th>Date</th></tr></thead>
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
       </table>`
    : `<p>${
        !app.id
          ? "No store ID to check against."
          : found
            ? "No published channel."
            : "Not checked yet — press Check this app for its channels and builds."
      }</p>`;

  const tr = document.createElement("tr");
  tr.className = "detail";
  tr.innerHTML = `
    <td colspan="8">
      ${note(found)}
      ${factGroups(groups)}
      ${
        listed?.error
          ? `<p class="warn">No store listing: ${esc(listed.error)}</p>`
          : ""
      }
      ${channelTable}
      <div class="actions">${actions}</div>
      <div class="resolve-out"></div>
      <div class="info-out"></div>
      <div class="versions-out"></div>
    </td>`;

  tr.querySelector("[data-check]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    checkOne(app);
  });

  tr.querySelector("[data-resolve]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    resolveId(app, tr.querySelector(".resolve-out"), e.currentTarget);
  });

  const infoBtn = tr.querySelector("[data-info]");
  if (infoBtn) {
    const infoOut = tr.querySelector(".info-out");
    syncInfoButton(infoBtn, app);

    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleAppInfo(app, infoOut, infoBtn);
    });

    if (infoOpen.has(app.id) && infoCache.has(app.id)) {
      drawAppInfo(infoOut, infoCache.get(app.id));
    }
  }

  /* Checking an app returns its whole build history, so the list appears on its
     own once a check has run — there is nothing separate to press. */
  if (versionCache.has(app.id)) {
    drawVersions(tr.querySelector(".versions-out"), versionCache.get(app.id), VERSION_PAGE);
  }

  return tr;
}

/* ---------- binary manifest ---------- */

const infoCache = new Map();
const infoOpen = new Set();

function syncInfoButton(button, app) {
  button.textContent = infoOpen.has(app.id) ? "Hide app info" : "More app info";
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

function drawAppInfo(out, info) {
  out.innerHTML = `
    <h3>Binary manifest</h3>
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
        ],
      ],
      [
        "Needs",
        [
          ["Built for", info.targetSdk && `Android SDK ${info.targetSdk}`],
          ["OS", info.requiredOs],
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
 */
function downloadCell(v, offerDev) {
  if (!v.id) return "";

  const dev = !v.channels.length;
  if (dev && !offerDev) return "";

  if (!canDownload()) {
    return `<a class="dl dl-off" href="#settings"
              title="Add your oc_ac_at account token in Settings">Download</a>`;
  }

  return `<a class="dl${dev ? " dl-dev" : ""}" href="${esc(downloadURL(v.id))}"
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
  keepScroll = false
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
              (v) => `<tr${v.channels.length ? ' class="on-channel"' : ""}>
                <td>${esc(v.version)}</td>
                <td class="bid">${buildId(v)}</td>
                <td>${v.releasedAt ?? "—"}</td>
                <td>${v.channels.length ? esc(v.channels.join(", ")) : "—"}</td>
                <td>${downloadCell(v, offerDev)}</td>
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

  out.querySelector(".more-versions")?.addEventListener("click", (e) => {
    e.stopPropagation();
    drawVersions(out, list, limit + VERSION_PAGE, mode, true);
  });

  out.querySelector(".build-sort")?.addEventListener("change", (e) => {
    e.stopPropagation();
    /* Reordering starts the list again rather than keeping a page count that
       was counted against a different order, so the top is where to be. */
    drawVersions(out, list, VERSION_PAGE, e.target.value, false);
  });
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
    const scope = tr.closest("tbody") === el.metaRows ? "meta" : "main";
    const next = tr.nextElementSibling;

    tr.replaceWith(appRow(app, scope));
    if (next?.classList.contains("detail")) next.replaceWith(detailRow(app));
  }
}

async function checkOne(app, { listing: wantListing = true } = {}) {
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
     a missing genre is no reason to lose the build history. */
  const [history, store] = await Promise.allSettled([
    checkApp(app),
    wantListing ? storeListing(app.id, el.hmd.value) : Promise.resolve(null),
  ]);

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
  }

  refreshRow(app);
  syncRelayNote();
}

async function checkList(list, button, label) {
  if (!list.length) return;

  el.checkAll.disabled = true;
  el.checkMeta.disabled = true;

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
      /* A sweep is about versions, and none of the listing shows in the table —
         so skip it here and halve the requests. Opening a row and pressing
         Check this app fills it in. */
      await checkOne(app, { listing: false });
      done += 1;
      button.textContent = `Checking ${done} of ${checkable.length}…`;
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, checkable.length) }, worker)
  );

  button.textContent = label;
  el.checkAll.disabled = false;
  el.checkMeta.disabled = false;
}

/* ---------- util ---------- */

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
