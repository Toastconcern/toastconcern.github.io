/* check.js — the only file that talks to the outside world.
 *
 * Requests go to the same endpoint the Quest store uses. Two things decide
 * whether they succeed, and both live on the Settings page:
 *
 *   token — an Oculus access token. A public one is built in and is enough for
 *           public LIVE builds; your own may see more.
 *   relay — graph.oculus.com answers with `Access-Control-Allow-Origin:
 *           https://facebook.com`, so a browser on any other domain performs the
 *           request and is then refused the response. Nothing about the token
 *           changes that; it is decided by the page's origin. A relay is a small
 *           service you control that fetches the URL server-side and returns it
 *           with permissive CORS headers.
 */

const ENDPOINT = "https://graph.oculus.com/graphql";
const NODE = "https://graph.oculus.com";

/* Every binary ever uploaded for an app, not just what a channel points at.
   Beat Saber alone returns nearly three thousand. */
const HISTORY_DOC_ID = "2885322071572384";

/** Works for public store data. Replace it on the Settings page if you have your own. */
export const DEFAULT_TOKEN = "OC|1317831034909742|";

/* ---------- settings ---------- */

/* Settings were stored under an oculusdb.* prefix before the rename. Carry them
   over once so nobody has to paste their token again. */
(function migrate() {
  try {
    for (const key of ["token", "acToken", "relay", "images", "details", "devDownloads", "limit", "store"]) {
      const old = localStorage.getItem(`oculusdb.${key}`);
      if (old !== null && localStorage.getItem(`metadb.${key}`) === null) {
        localStorage.setItem(`metadb.${key}`, old);
      }
      localStorage.removeItem(`oculusdb.${key}`);
    }
  } catch {}
})();

export function loadSettings() {
  try {
    return {
      token: localStorage.getItem("metadb.token") || DEFAULT_TOKEN,
      acToken: localStorage.getItem("metadb.acToken") || "",
      relay: localStorage.getItem("metadb.relay") || "",
      images: localStorage.getItem("metadb.images") === "1",
      details: localStorage.getItem("metadb.details") === "1",
      devDownloads: localStorage.getItem("metadb.devDownloads") === "1",
      /* On unless turned off: a build with an OBB is no use without it. */
      obb: localStorage.getItem("metadb.obb") !== "0",
      /* Off by default: fetch the library on load and tint apps you own. */
      autoOwned: localStorage.getItem("metadb.autoOwned") === "1",
      /* On unless turned off, same as the OBB lookup above. */
      wide: localStorage.getItem("metadb.wide") !== "0",
      /* On unless turned off, like the store button. */
      motion: localStorage.getItem("metadb.motion") !== "0",
      motionSpeed: localStorage.getItem("metadb.motionSpeed") || "180",
      fontSize: localStorage.getItem("metadb.fontSize") || "16",
      limit: localStorage.getItem("metadb.limit") || "",
      /* Starting values for the on-page pickers. */
      hmd: localStorage.getItem("metadb.hmd") || "EUREKA",
      searchSort: localStorage.getItem("metadb.searchSort") || "relevance",
      mineSort: localStorage.getItem("metadb.mineSort") || "az",
      buildSort: localStorage.getItem("metadb.buildSort") || "released",
      /* On unless explicitly turned off, so it keeps its old behaviour. */
      store: localStorage.getItem("metadb.store") !== "0",
      /* Column classes the user has switched off. */
      hidden: (localStorage.getItem("metadb.hidden") ?? "")
        .split(",")
        .filter(Boolean),
    };
  } catch {
    return {
      token: DEFAULT_TOKEN,
      acToken: "",
      relay: "",
      images: false,
      details: false,
      devDownloads: false,
      obb: true,
      autoOwned: false,
      wide: true,
      motion: true,
      motionSpeed: "180",
      fontSize: "16",
      limit: "",
      hmd: "EUREKA",
      searchSort: "relevance",
      mineSort: "az",
      buildSort: "released",
      store: true,
      hidden: [],
    };
  }
}

/**
 * A patch: only the keys present are written, so callers cannot clear the rest.
 *
 * A switch that is off is written as "0" rather than removed. Removing it is
 * the same as never having set it, and the settings that default to on — the
 * store button, the animations — read "not set" as on, so turning them off did
 * nothing at all. Text and lists still remove when empty, which is what makes
 * an emptied token fall back to the built-in one.
 */
export function saveSettings(patch) {
  try {
    for (const [key, value] of Object.entries(patch)) {
      const name = `metadb.${key}`;

      if (typeof value === "boolean") {
        localStorage.setItem(name, value ? "1" : "0");
        continue;
      }

      const stored = Array.isArray(value) ? value.join(",") : value;
      if (stored) localStorage.setItem(name, stored);
      else localStorage.removeItem(name);
    }
  } catch {
    throw new Error("this browser refused to store the settings");
  }
}

export function clearSettings() {
  try {
    for (const key of ["token", "acToken", "relay", "images", "details", "devDownloads", "obb", "autoOwned", "wide", "motion", "motionSpeed", "fontSize", "hidden", "limit", "store", "hmd", "searchSort", "mineSort", "buildSort"]) {
      localStorage.removeItem(`metadb.${key}`);
    }
  } catch {}
}

/* The site's own relay, when it is hosted somewhere that can run one. Being a
   relative path it is same-origin, so no cross-origin rule applies and there is
   nothing for anyone to configure. A static host has no such endpoint, which is
   what `builtInMissing` ends up recording. */
const BUILT_IN_RELAY = "/api?url={url}";

let builtInMissing = false;

/** True once the built-in relay has turned out not to exist on this host. */
export const needsRelay = () => builtInMissing && !loadSettings().relay;

/**
 * Put a URL through a relay. A relay set in Settings wins; otherwise the site's
 * own /api is used. `{url}` is replaced with the encoded target, or the encoded
 * target is appended if the pattern has no placeholder.
 */
function route(url) {
  const relay = loadSettings().relay || BUILT_IN_RELAY;
  return relay.includes("{url}")
    ? relay.replace("{url}", encodeURIComponent(url))
    : relay + encodeURIComponent(url);
}

async function getJSON(url) {
  const { relay } = loadSettings();
  let res;

  try {
    res = await fetch(route(url), { headers: { Accept: "application/json" } });
  } catch {
    throw new Error(
      relay
        ? "could not reach the relay — check the URL on the Settings page"
        : "the browser blocked this request; set a relay URL on the Settings page"
    );
  }

  /* A static host has no /api, so the built-in relay 404s. Say so once rather
     than letting it read as the store refusing the request. */
  if (!relay && res.status === 404) {
    builtInMissing = true;
    throw new Error(
      "this site has no built-in relay — set a relay URL on the Settings page"
    );
  }

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = stitch(text);
  }

  if (!json) {
    /* Quote the start of the body. "Not JSON" on its own is a dead end — an
       empty reply, a relay error page and a login redirect all look the same
       from here, and they need different fixes. */
    const snippet = text.trim()
      ? `${res.status}: ${text.trim().replace(/\s+/g, " ").slice(0, 120)}`
      : `${res.status} with an empty body`;
    throw new Error(
      res.ok
        ? `the reply was not JSON — got ${snippet}`
        : `store returned ${snippet}`
    );
  }

  /* A failing status usually still carries a useful explanation in the body,
     so prefer that over the bare status code. */
  if (!res.ok && !json.error && !json.errors) {
    throw new Error(`store returned ${res.status}`);
  }

  return json;
}

/** Every top-level JSON object in a body that holds several, back to back. */
function split(text) {
  const out = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }

    if (c === '"') {
      inString = true;
    } else if (c === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (c === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        try {
          out.push(JSON.parse(text.slice(start, i + 1)));
        } catch {
          return out;
        }
        start = -1;
      }
    }
  }

  return out;
}

/**
 * One object out of a reply delivered in instalments.
 *
 * Some store queries answer with GraphQL incremental delivery: the skeleton
 * first, then a run of objects that fill in the slow parts as the server
 * finishes them, concatenated with nothing in between — so `JSON.parse` stops
 * at the second `{`. Each instalment says where it belongs (`path`), so they
 * can be put back where they came from and the caller never has to know the
 * reply arrived in pieces.
 *
 * Returns null when the text is not JSON at all, which is a different problem.
 */
function stitch(text) {
  const parts = split(text);
  const root = parts.find((p) => p.data || p.errors || p.error) ?? null;
  if (!root?.data) return root;

  for (const part of parts) {
    if (part === root || !part.data || !Array.isArray(part.path)) continue;

    let node = root.data;
    for (const step of part.path) node = node?.[step];
    if (node && typeof node === "object") Object.assign(node, part.data);
  }

  return root;
}

const day = (secs) => new Date(secs * 1000).toISOString().slice(0, 10);

/* ---------- build history ---------- */

function historyURL(id) {
  const { token } = loadSettings();
  return `${ENDPOINT}?${new URLSearchParams({
    access_token: token,
    doc_id: HISTORY_DOC_ID,
    variables: JSON.stringify({ applicationID: String(id) }),
  })}`;
}

/**
 * Every binary the store holds for an app, newest first, plus the newest build
 * on each channel worked out from the channel links each binary carries.
 *
 * Most builds were never released, so `channels` is empty on the majority of
 * them. That is the difference between `newest` (anything, including internal
 * builds) and `live` (the newest thing actually published to a channel).
 */
function parseHistory(json) {
  if (json?.errors?.length) throw new Error(json.errors[0].message);
  if (json?.error) throw new Error(json.error.message ?? "request rejected");

  const nodes = json?.data?.node?.primary_binaries?.nodes;
  if (!nodes) throw new Error("no build history in the reply");

  const builds = nodes
    .map((b) => ({
      id: b.id,
      version: b.version ?? "—",
      versionCode: b.version_code,
      releasedAt: b.created_date ? day(b.created_date) : null,
      createdAt: b.created_date ?? 0,
      fileName: b.file_name ?? "",
      channels: (b.binary_release_channels?.nodes ?? [])
        .map((c) => c.channel_name)
        .filter(Boolean),
    }))
    .sort((a, b) => b.createdAt - a.createdAt);

  /* Channels are named on every binary that reached one, and carry their own
     ID — which is what the OBB lookup is keyed by, so it is kept here. */
  const channelIds = new Map();
  for (const node of nodes) {
    for (const c of node.binary_release_channels?.nodes ?? []) {
      if (c?.channel_name && c.id) channelIds.set(c.channel_name, String(c.id));
    }
  }

  /* Walking newest-first means the first time a channel appears is its latest. */
  const byChannel = new Map();
  for (const b of builds) {
    for (const name of b.channels) {
      if (byChannel.has(name)) continue;
      byChannel.set(name, {
        name,
        id: channelIds.get(name) ?? null,
        group: name === "LIVE" ? "PRIMARY" : "CUSTOM",
        version: b.version,
        versionCode: b.versionCode,
        releasedAt: b.releasedAt,
      });
    }
  }

  const channels = [...byChannel.values()];
  const live = channels.find((c) => c.name === "LIVE") ?? channels[0] ?? null;

  /* Developer-side submission history, when the token can see it — it rides
     along on the app node beside the binaries rather than in the store listing. */
  const revisions = (json?.data?.node?.revisions?.nodes ?? []).map((r) => ({
    id: r.id ?? null,
    status: r.administration_status ? words(r.administration_status) : null,
    created: r.created_date ? day(r.created_date) : null,
    submissions: r.submission_events?.count ?? 0,
  }));

  return { builds, channels, live, newest: builds[0] ?? null, revisions };
}

export async function fetchHistory(id) {
  return parseHistory(await getJSON(historyURL(id)));
}

/**
 * What the store has for one app.
 *
 * Read from the build history rather than the release-channel query, so the
 * answer covers both halves: `version` is the newest build actually published
 * to a channel, and `newest` is the newest build full stop — often an internal
 * one that is ahead of everything released.
 *
 * Resolves to { version, versionCode, releasedAt, channel, channels, newest,
 * builds, total } or throws.
 */
export async function checkApp(app) {
  const { builds, channels, live, newest, revisions } = await fetchHistory(app.id);

  if (!live && !newest) throw new Error("no published binary");

  const head = live ?? newest;

  return {
    version: head.version,
    versionCode: head.versionCode,
    releasedAt: head.releasedAt,
    channel: live ? live.name : "unreleased",
    channels,
    newest,
    builds,
    total: builds.length,
    revisions,
  };
}

/** Fetch one app by store ID, name and builds included. */
export async function lookupApp(id) {
  const { token } = loadSettings();

  const meta = await getJSON(
    `${NODE}/${encodeURIComponent(id)}/?` +
      new URLSearchParams({ access_token: token, fields: "display_name,platform" })
  );

  if (meta.error) throw new Error(meta.error.message ?? "app not found");

  const latest = await checkApp({ id });

  return {
    id: String(id),
    name: meta.display_name,
    platform: meta.platform,
    channels: latest.channels ?? [],
  };
}

/* Store search. Like the package query it wants a logged-in account token —
   an app token comes back "Unauthorized logged out query." hmdType picks which
   headset's store to search; EUREKA is Quest 3. */
const SEARCH_DOC_ID = "3928907833885295";

/* hmdType picks which headset's store is searched. These are the store's own
   codenames; EUREKA is the one confirmed working here, the rest follow Meta's
   published device names. The raw value is shown in the picker so a wrong guess
   is visible rather than silent. */
export const HMD_TYPES = [
  ["EUREKA", "Quest 3"],
  ["PANTHER", "Quest 3S"],
  ["SEACLIFF", "Quest Pro"],
  ["HOLLYWOOD", "Quest 2"],
  ["MONTEREY", "Quest"],
  ["RIFT", "Rift"],
  ["LOMA", "Unknown"],
];

/**
 * Pull apps out of a search reply.
 *
 * Results arrive grouped into categories — "APPS" and "CONCEPT" (labelled "More
 * Apps and Games") — and the same app can appear in both, so they are collapsed
 * by ID with the first category winning. The node's own `id` is an opaque story
 * ID; the app lives under `target_object`.
 */
function extractApps(json) {
  const categories = json?.data?.viewer?.contextual_search?.all_category_results;
  if (!Array.isArray(categories)) return [];

  const out = new Map();

  for (const category of categories) {
    for (const node of category?.search_results?.nodes ?? []) {
      const app = node?.target_object;
      if (!app?.id || out.has(app.id)) continue;

      out.set(app.id, {
        id: String(app.id),
        name: app.display_name || app.canonicalName || app.id,
        slug: app.canonicalName ?? null,
        category: category.display_name ?? category.name ?? null,
        /* The slug ends in the platform, e.g. "…-android6d0f". */
        platform: /android6d0f/i.test(app.canonicalName ?? "")
          ? "ANDROID_6DOF"
          : /android3dof/i.test(app.canonicalName ?? "")
            ? "ANDROID_3DOF"
            : null,
        /* Free apps report "$0.00"; pre-orders and coming-soon carry no price. */
        price: app.current_offer?.price?.formatted ?? null,
        /* What a claim is made against, and whether there is anything to pay.
           `offset_amount` is minor units as a string, so "0" is the only free
           one; a coming-soon offer has no price at all and is not free. */
        offerId: app.current_offer?.id ? String(app.current_offer.id) : null,
        free: app.current_offer?.price?.offset_amount === "0",
        releasedAt: app.release_date
          ? new Date(app.release_date * 1000).toISOString().slice(0, 10)
          : null,
        image: app.cover_square_image?.uri ?? null,
      });
    }
  }

  return [...out.values()];
}

/* The updater query the headset itself uses to work out what to download. It
   returns the binary's manifest: size, permissions, target SDK, hashes and the
   OS version it needs. Like the other client_doc_id queries it wants a
   logged-in account token. */
const DETAILS_DOC_ID = "38375779192687022983111059848";

const PATCH_ALGORITHMS = [
  "RDIFF",
  "PUFFIN",
  "PUFFIN_LZ4",
  "SUPERPACK_V1",
  "SUPERPACK_V1_NOSOURCE",
];

/**
 * The full manifest for an app's current binary.
 *
 * `installed_version_code` is sent as 0 — the query is phrased as "what should
 * this headset download", and claiming nothing is installed makes the store
 * describe the latest build rather than a patch against something else.
 */
export async function appDetails(id) {
  const { token } = loadSettings();

  const json = await getJSON(
    `${ENDPOINT}?` +
      new URLSearchParams({
        access_token: token,
        client_doc_id: DETAILS_DOC_ID,
        variables: JSON.stringify({
          params: {
            app_params: [
              {
                app_id: String(id),
                installed_version_code: "0",
                has_source_stamp: false,
                supported_patch_algorithms: PATCH_ALGORITHMS,
                for_pre_download: false,
                installed_apk_cert_signature: "",
              },
            ],
          },
          fetch_all_assets: false,
          includeLatestAvailableBinary: true,
          fetch_fallback_uris: false,
          compatibilityFilter: "DEFAULT_PSDK",
          gpu_hash: "",
        }),
      })
  );

  if (json.errors?.length) {
    const msg = json.errors[0].message ?? "query refused";
    throw new Error(
      /logged out|unauthorized/i.test(msg)
        ? `${msg} This query needs a logged-in account token, set on the Settings page.`
        : msg
    );
  }
  if (json.error) throw new Error(json.error.message ?? "request rejected");

  const update = json?.data?.app_binary_updates?.updates?.[0];
  const binary = update?.new_binary;
  if (!binary) throw new Error("no binary manifest in the reply");

  /* The OS and platform-SDK requirements ride along as dependency configs
     rather than fields. PSDK is the Meta platform SDK the build was made
     against — a headset on an older PSDK is told to update before it can run it. */
  const deps =
    update.application?.latest_available_binary?.dependency_configs?.edges ?? [];
  const depNodes = deps.map((e) => e.node);
  const requiredOs = depNodes.find((n) =>
    /required_os_version/i.test(n?.identifier ?? "")
  )?.version;
  const requiredPsdk = depNodes.find((n) =>
    /required_psdk_version/i.test(n?.identifier ?? "")
  )?.version;

  return {
    packageName: binary.package_name ?? null,
    version: binary.version ?? null,
    versionCode: binary.version_code ?? null,
    size: Number(binary.size) || null,
    requiredSpace: Number(binary.required_space) || null,
    fileName: binary.file_name ?? null,
    targetSdk: binary.target_android_sdk_version ?? null,
    headTracking: binary.head_tracking ?? null,
    externalStorage: binary.can_use_external_storage ?? null,
    releasedAt: binary.release_date ? day(binary.release_date) : null,
    requiredOs: requiredOs ?? null,
    requiredPsdk: requiredPsdk ?? null,
    sha256: binary.sha256 ?? null,
    checksum: binary.checksum_hash ?? null,
    certSignature: binary.apk_cert_signature ?? null,
    permissions: binary.permissions ?? [],
    updateRequired:
      update.application?.latest_available_binary?.is_update_required ?? null,
  };
}

/* The query behind the Details panel further down an app's store page. It is
   the one place the store publishes what a game actually supports — modes,
   controllers, headsets, category — and it carries the publisher, comfort
   rating and rating counts too, so one call covers the lot. */
const STORE_DOC_ID = "26038741162490780";

/** SITTING -> Sitting, COMFORTABLE_FOR_SOME -> Comfortable for some. */
const words = (s) =>
  String(s)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

/* ROOM_SCALE would come out of `words` as "Room scale"; the store writes it
   as one word, and these three are the whole set. */
const PLAYER_MODES = {
  SITTING: "Sitting",
  STANDING: "Standing",
  ROOM_SCALE: "Roomscale",
};

/** Bytes as GB, which is the unit the store prints install sizes in. */
const gb = (bytes) =>
  Number(bytes) ? `${(Number(bytes) / 1024 ** 3).toFixed(2)} GB` : null;

/**
 * What the store says an app is: genres, category, the modes and hardware it
 * supports, who made it, how big it installs.
 *
 * The reply arrives in instalments — the details are a deferred fragment that
 * follows the description — which `getJSON` has already put back together.
 * Two of the fields the store shows are spelled as codes rather than prose
 * (player modes, comfort) and are turned back into words here.
 */
export async function storeListing(id, hmdType = loadSettings().hmd) {
  const { token } = loadSettings();

  const json = await getJSON(
    `${ENDPOINT}?` +
      new URLSearchParams({
        access_token: token,
        doc_id: STORE_DOC_ID,
        variables: JSON.stringify({
          hmdType,
          itemId: String(id),
          /* The page turns these on to get the metadata line and off to skip
             the AI review summary. Both are required. */
          __relay_internal__pv__MDCAppStorFortheMetadataLineEnablerelayprovider: true,
          __relay_internal__pv__MDCAppStoreGenAIReviewSummaryEnabledrelayprovider: false,
        }),
      })
  );

  if (json.errors?.length) throw new Error(json.errors[0].message ?? "query refused");
  if (json.error) throw new Error(json.error.message ?? "request rejected");

  const app = json?.data?.app_store_item;
  if (!app) throw new Error("no listing in the reply");

  /* The description comes back immediately and the details follow. When only
     the first instalment arrives the store has answered, just not with the
     part worth having — say so rather than showing a panel of blanks. */
  if (app.genre_names === undefined && app.category_name === undefined) {
    throw new Error(
      "the store sent the description but not the details — that half needs a " +
        "logged-in access token, set on the Settings page"
    );
  }

  const binary = app.latest_supported_binary ?? {};
  const count = app.quality_rating_i18n_count_string;

  return {
    name: app.display_name ?? null,
    genres: app.genre_names ?? [],
    category: app.category_name ?? null,
    modes: app.user_interaction_mode_names ?? [],
    playerModes: (app.supported_player_modes ?? []).map((m) => PLAYER_MODES[m] ?? words(m)),
    controllers: app.supported_input_device_names ?? [],
    platforms: app.supported_platforms_i18n ?? [],
    publisher: app.publisher_name ?? null,
    developer: app.developer_name ?? null,
    orgId: app.organization?.id ?? null,
    comfort: app.comfort_rating ? words(app.comfort_rating) : null,
    internet: app.internet_connection_name ?? null,
    languages: (app.supported_in_app_languages ?? []).map((l) => l.name),
    installSize: gb(binary.total_installed_space),
    released: app.release_info?.display_date ?? null,
    rating: app.quality_rating_i18n_score_string ?? null,
    ratingCount: count && count !== "0" ? count : null,
    website: app.website_url ?? null,
    hasAds: app.has_in_app_ads ?? null,
  };
}

/* The app-page (above-the-fold) query. It carries the buy button, which is the
   only place an app's claimable offer and its price live — the store listing and
   the build history have neither. */
const OFFER_DOC_ID = "27653348084360166";

/**
 * One app's current offer: its ID and whether it costs nothing. Returns null
 * when the store shows no offer (unpublished, region-locked, or system apps that
 * cannot be claimed). Used to light up the Get-entitlement button on apps that
 * did not arrive from a search — Meta apps and an organization's apps.
 */
export async function appOffer(id, hmdType = loadSettings().hmd) {
  const { token } = loadSettings();

  const json = await getJSON(
    `${ENDPOINT}?` +
      new URLSearchParams({
        access_token: token,
        doc_id: OFFER_DOC_ID,
        variables: JSON.stringify({ itemId: String(id), hmdType }),
      })
  );

  if (json.errors?.length) throw new Error(json.errors[0].message ?? "query refused");
  if (json.error) throw new Error(json.error.message ?? "request rejected");

  const offer = json?.data?.app_store_item?.current_offer;
  if (!offer?.id) return null;

  return {
    offerId: String(offer.id),
    free: offer.price?.offset_amount === "0",
  };
}

/** Search the store by name. Resolves to [{ id, name, price, … }] or throws. */
export async function searchStore(query, { limit = 5, hmdType = "EUREKA" } = {}) {
  const { token } = loadSettings();

  const json = await getJSON(
    `${ENDPOINT}?` +
      new URLSearchParams({
        access_token: token,
        doc_id: SEARCH_DOC_ID,
        variables: JSON.stringify({
          query,
          hmdType,
          firstSearchResultItems: limit,
        }),
      })
  );

  if (json.errors?.length) {
    const msg = json.errors[0].message ?? "query refused";
    throw new Error(
      /logged out|unauthorized/i.test(msg)
        ? `${msg} Store search needs a logged-in account token, set on the Settings page.`
        : msg
    );
  }

  if (json.error) throw new Error(json.error.message ?? "request rejected");

  return extractApps(json).slice(0, limit);
}

/* Maps Android package names to store app IDs. Takes an array, so a whole
   screen's worth resolves in one request. Note this one uses `client_doc_id`,
   not `doc_id`, and it is refused unless the token belongs to a logged-in
   account — an app token comes back "Unauthorized logged out query." */
const PACKAGE_DOC_ID = "130289649615311830816220616253";

/**
 * Walk a reply of unknown shape and pick out { package name -> id, name }.
 *
 * The exact structure this query returns is not documented, so rather than
 * hard-code a path, look for any object that carries a store-shaped id
 * alongside one of the package names that was asked for.
 */
function extractPackageIds(json, wanted) {
  const want = new Set(wanted);
  const found = new Map();

  const isId = (v) => typeof v === "string" && /^\d{8,}$/.test(v);

  (function walk(node) {
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    const values = Object.values(node);
    const pkg = values.find((v) => typeof v === "string" && want.has(v));
    const id = [node.id, node.appId, node.application_id, ...values].find(isId);

    if (pkg && id && !found.has(pkg)) {
      /* This query tends to echo the package back as the name. Curated names in
         the data file are better than that, so only report a name when it is
         genuinely a display name. */
      const display =
        node.display_name || node.displayName || node.name || node.appName;

      found.set(pkg, {
        id: String(id),
        name: display && display !== pkg ? display : null,
        platform: node.platform ?? "ANDROID_6DOF",
      });
    }

    values.forEach(walk);
  })(json);

  return found;
}

/**
 * Resolve many package names at once.
 * Resolves to a Map of package name -> { id, name, platform }.
 */
export async function lookupPackages(packageNames) {
  const { token } = loadSettings();

  const json = await getJSON(
    `${ENDPOINT}?` +
      new URLSearchParams({
        access_token: token,
        client_doc_id: PACKAGE_DOC_ID,
        variables: JSON.stringify({ package_names: packageNames }),
      })
  );

  if (json.errors?.length) {
    const msg = json.errors[0].message ?? "query refused";
    throw new Error(
      /logged out|unauthorized/i.test(msg)
        ? `${msg} This query needs a logged-in account token, set on the Settings page.`
        : msg
    );
  }

  if (json.error) throw new Error(json.error.message ?? "request rejected");

  const found = extractPackageIds(json, packageNames);

  if (!found.size) {
    throw new Error(
      "the reply carried no recognisable app IDs — the response shape may have changed"
    );
  }

  return found;
}

/** Resolve one package name into a full catalog record, channels included. */
export async function lookupByPackage(packageName) {
  const hit = (await lookupPackages([packageName])).get(packageName);
  if (!hit) throw new Error("no app matched that package name");

  /* No name key at all when the store had nothing better than the package, so
     merging this over an existing record leaves its name alone. */
  const out = { id: hit.id, packageName, platform: hit.platform };
  if (hit.name) out.name = hit.name;

  try {
    out.channels = (await checkApp({ id: out.id })).channels ?? [];
  } catch {
    out.channels = [];
  }

  return out;
}

/* The library queries the client itself runs — every entitlement on the
   account, with the binary each one is currently allowed to install. One per
   store: the headset asks for its Android library, the desktop app for the
   Rift one. Like the other client_doc_id queries they want a logged-in account
   token, and both take the same variables. */
const ENTITLEMENTS_DOC_IDS = {
  quest: "412097616712440770934752951129",
  pc: "2890869346616033607941569925",
};

/* Sent as the headset sends them. Most are artwork sizes this page never uses,
   but the query is persisted: it takes the variables it was built with or
   nothing. `cursorID` is the one that changes, a page at a time. */
const ENTITLEMENTS_VARIABLES = {
  smallLandscapeImageSize: "180x100",
  skipFetchingRequiredUpdates: true,
  coverSquareImageSize: "225x225",
  iconImageSize: "64x64",
  landscapeImageSize: "405x720",
  fetch_fallback_uris: true,
  machine_id: "1",
  imageScale: 1.0,
  cursorID: null,
  count: 1000,
  allFields: true,
  onlyDefaultApps: false,
  excludePackages: null,
  fetchAchievementBasedTrialInfo: false,
  compatibilityFilter: "DEFAULT",
};

/* A thousand at a time, and the reply still says there is more — so this pages.
   The cap is what stops a cursor that never advances from looping forever. */
const ENTITLEMENT_PAGES = 10;

/**
 * One entitlement edge as a row.
 *
 * The edge's own `id` is the entitlement ("<user>:<app>"), not the app — the
 * app is `item`, and that is the ID everything else here is keyed by.
 * `latest_supported_binary` is the build this account may install right now,
 * which is what fills the version columns before any check has run.
 */
function entitlementApp(node, platform) {
  const app = node?.item;
  if (!app?.id) return null;

  const binary = app.latest_supported_binary ?? null;

  return {
    id: String(app.id),
    name: app.display_name || app.package_name || String(app.id),
    packageName: app.package_name ?? null,
    /* Each library is one store's worth, so the query answers this rather than
       the row — unless the reply says otherwise for itself. */
    platform: app.platform ?? platform,
    /* Marks the row as coming from a library rather than the store, which says
       nothing about channels either way. */
    owned: true,
    /* PAID_OFFER, NUX, DEVELOPER, OCULUS_KEYS … how it was come by. */
    grant: node.grant_reason ?? null,
    /* PERMANENT, or a lease with an expiry — a trial or a subscription. */
    state: node.active_state ?? null,
    /* The query asks for artwork — the sizes are in its variables — but the
       capture this was built from came back without any. Whichever of these
       the store does fill in is used; with none, the row simply has no art. */
    image:
      app.cover_square_image?.uri ??
      app.icon_image?.uri ??
      app.cover_landscape_image?.uri ??
      null,
    lastUsed: node.last_used || null,
    latest: binary
      ? {
          version: binary.version ?? null,
          versionCode: binary.version_code ?? null,
          id: binary.id ?? null,
          releasedAt: null,
        }
      : null,
  };
}

/**
 * The connection holding the entitlements, whatever this library calls it.
 *
 * The Quest reply files them under `active_android_entitlements`; the Rift one
 * uses its own name. Both put a single connection under `entitlements`, so it
 * is taken by shape rather than by a name that has to be guessed at.
 */
function entitlementConnection(json) {
  const root = json?.data?.entitlements;
  if (!root || typeof root !== "object") return null;
  return Object.values(root).find((v) => v && Array.isArray(v.edges)) ?? null;
}

/**
 * Everything the signed-in account owns, from one store's library.
 *
 * `kind` is "quest" for the Android library or "pc" for the Rift one — two
 * queries, same variables, same shape. Entitlements belong to a person, so
 * this reads the access token (`oc_www_at`); the built-in public one has no
 * account behind it and is refused.
 */
export async function myEntitlements(kind = "quest") {
  const { token } = loadSettings();

  const clientDocId = ENTITLEMENTS_DOC_IDS[kind];
  if (!clientDocId) throw new Error(`no entitlements query for "${kind}"`);

  const platform = kind === "pc" ? "PC" : "ANDROID_6DOF";

  const out = new Map();
  let cursor = null;

  for (let page = 0; page < ENTITLEMENT_PAGES; page++) {
    const json = await getJSON(
      `${ENDPOINT}?` +
        new URLSearchParams({
          access_token: token,
          client_doc_id: clientDocId,
          variables: JSON.stringify({
            ...ENTITLEMENTS_VARIABLES,
            cursorID: cursor,
          }),
        })
    );

    if (json.errors?.length) {
      const msg = json.errors[0].message ?? "query refused";
      throw new Error(
        /logged out|unauthorized/i.test(msg)
          ? `${msg} Your entitlements needs your own account token, set on the Settings page.`
          : msg
      );
    }

    if (json.error) throw new Error(json.error.message ?? "request rejected");

    const list = entitlementConnection(json);
    if (!list) {
      throw new Error(
        "the store returned no entitlements list — this one needs an access " +
          "token belonging to a logged-in account, set on the Settings page"
      );
    }

    for (const edge of list.edges ?? []) {
      const app = entitlementApp(edge?.node, platform);
      if (app && !out.has(app.id)) out.set(app.id, app);
    }

    if (!list.page_info?.has_next_page) break;
    cursor = list.page_info.end_cursor ?? null;
    if (!cursor) break;
  }

  return [...out.values()];
}

/* Claiming a free app — the mutation behind the store's own Get button. It is
   an offer that is claimed, not an app, and only one with nothing to pay: the
   store refuses anything priced, which is why the button is only offered where
   the price is zero. Like a download it acts as you, but on the access token
   (`oc_www_at`) rather than the account one. */
const CLAIM_DOC_ID = "24220194524234992";

/**
 * Add a free app to the signed-in account.
 *
 * Resolves when the store accepts it; throws with the store's own words when
 * it does not — already owned, priced, or a token with no account behind it.
 */
export async function claimOffer(offerId, hmdType = loadSettings().hmd) {
  const { token } = loadSettings();

  const json = await getJSON(
    `${ENDPOINT}?` +
      new URLSearchParams({
        access_token: token,
        doc_id: CLAIM_DOC_ID,
        variables: JSON.stringify({
          input: {
            offer_id: String(offerId),
            hmd_type: hmdType,
            include_entitlement: true,
            client_mutation_id: "1",
          },
        }),
      })
  );

  if (json.errors?.length) {
    const msg = json.errors[0].message ?? "the store refused it";
    throw new Error(
      /logged out|unauthorized/i.test(msg)
        ? `${msg} Claiming needs your own access token, set on the Settings page.`
        : msg
    );
  }

  if (json.error) throw new Error(json.error.message ?? "request rejected");

  /* The reply nests the result under the mutation's own name. Rather than
     hard-code that, take the first object under `data` and let the caller
     treat anything at all as acceptance — the errors above are the failures. */
  return Object.values(json.data ?? {})[0] ?? {};
}

/* One release channel: the binaries on it and the app's recent uploads, each
   with the ID of its OBB expansion file where there is one. Nothing else here
   reports OBBs — not the build history, not the manifest — and it costs a
   request per channel, which is why it sits behind a setting. */
const CHANNEL_DOC_ID = "3973666182694273";

/**
 * Binary ID -> OBB binary ID, for one release channel.
 *
 * Both halves of the reply carry the pairing: `binaries` is what is on the
 * channel, `application.primary_binaries` the app's latest uploads whatever
 * channel they are on. Both are read, and both are one page — this query takes
 * a channel and nothing else, so there is no cursor to follow.
 */
export async function channelObbs(releaseChannelID) {
  const { token } = loadSettings();

  const json = await getJSON(
    `${ENDPOINT}?` +
      new URLSearchParams({
        access_token: token,
        doc_id: CHANNEL_DOC_ID,
        variables: JSON.stringify({ releaseChannelID: String(releaseChannelID) }),
      })
  );

  if (json.errors?.length) throw new Error(json.errors[0].message ?? "query refused");
  if (json.error) throw new Error(json.error.message ?? "request rejected");

  const node = json.data?.node;
  if (!node) throw new Error("the store returned no such release channel");

  const pairs = new Map();

  const take = (binary) => {
    if (binary?.id && binary.obb_binary?.id) {
      pairs.set(String(binary.id), String(binary.obb_binary.id));
    }
  };

  for (const edge of node.application?.primary_binaries?.edges ?? []) take(edge?.node);
  for (const edge of node.binaries?.edges ?? []) take(edge?.node);
  take(node.latest_supported_binary);

  return pairs;
}

/* ---------- an organization's apps ---------- */

/* The dashboard's grid pagination query. Unlike the initial loader (which is
   pinned to the first 20 and ignores every cursor argument), this one honours
   `after`, so walking it end to end returns the whole list. Twenty per page is
   the server's fixed size; `platform` filters to nothing here, so it is left
   null and the platform filtering is done on what comes back. */
const ORG_APPS_DOC_ID = "27915674441422265";

/**
 * Every app an organization has published, walked page by page so nothing is
 * cut off at 20. Each app carries its own `platform`, so the caller can filter.
 *
 * The org id is the numeric one in a dashboard URL. This needs a signed-in
 * `oc_www_at` — the built-in public token sees nothing here — so an empty result
 * on a real org usually means the token is missing.
 */
export async function orgApps(orgID) {
  const { token } = loadSettings();
  const out = new Map();
  let after = null;

  /* Safety cap: 40 pages × 20 is 800 apps, well past any real organization. */
  for (let page = 0; page < 40; page += 1) {
    const json = await getJSON(
      `${ENDPOINT}?` +
        new URLSearchParams({
          access_token: token,
          doc_id: ORG_APPS_DOC_ID,
          variables: JSON.stringify({
            after,
            display_name: null,
            exclude_hyperscapes: true,
            exclude_platforms: ["HORIZON_WORLD", "HORIZON_UNITY_WORLD"],
            first: 20,
            orderby: "DISPLAY_NAME",
            platform: null,
            id: String(orgID),
          }),
        })
    );

    if (json.errors?.length) throw new Error(json.errors[0].message ?? "query refused");
    if (json.error) throw new Error(json.error.message ?? "request rejected");

    const conn =
      json.data?.node?.applications ?? json.data?.organization?.applications ?? {};

    /* Same app shape the store search returns, so an org's apps render and
       expand through exactly the same list code as every other tab. */
    for (const edge of conn.edges ?? []) {
      const n = edge?.node;
      if (!n?.id || out.has(String(n.id))) continue;
      out.set(String(n.id), {
        id: String(n.id),
        name: n.display_name || String(n.id),
        slug: null,
        category: null,
        platform: n.platform ?? null,
        price: null,
        offerId: null,
        free: false,
        releasedAt: null,
        image: n.cover_landscape_image?.uri ?? null,
      });
    }

    const pi = conn.page_info ?? {};
    if (!pi.has_next_page || !pi.end_cursor) break;
    after = pi.end_cursor;
  }

  return [...out.values()];
}

/**
 * The store's own download endpoint for one binary, put through the relay.
 *
 * Downloads authenticate with the account token (`oc_ac_at`), not the one every
 * other request here uses. Meta decides whether to serve it: the account has to
 * be entitled to the app, so this is not a way around ownership.
 *
 * It goes through the relay rather than straight to the CDN so the request can
 * carry the companion app's `User-Agent`. That is a forbidden header name in a
 * browser — a page cannot set it on a link or a fetch — so the relay attaches it
 * on the way past. Everything here already needs a relay to work at all, so
 * this costs nothing that was not being paid.
 */
export function downloadURL(binaryId) {
  const { acToken } = loadSettings();
  return route(
    `https://securecdn.oculus.com/binaries/download/?${new URLSearchParams({
      id: String(binaryId),
      access_token: acToken,
    })}`
  );
}

/** Whether a download can be attempted at all. */
export const canDownload = () => Boolean(loadSettings().acToken);

/** Pull an app ID out of a bare ID or a store URL. */
export function parseAppId(input) {
  const text = String(input).trim();
  if (/^\d{5,}$/.test(text)) return text;
  const m = text.match(/(\d{8,})/);
  return m ? m[1] : null;
}
