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
    for (const key of ["token", "acToken", "relay", "images", "details", "limit", "store"]) {
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
      limit: localStorage.getItem("metadb.limit") || "",
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
      limit: "",
      store: true,
      hidden: [],
    };
  }
}

/** A patch: only the keys present are written, so callers cannot clear the rest. */
export function saveSettings(patch) {
  try {
    for (const [key, value] of Object.entries(patch)) {
      const name = `metadb.${key}`;
      const stored = Array.isArray(value)
        ? value.join(",")
        : typeof value === "boolean"
          ? value
            ? "1"
            : ""
          : value;
      if (stored) localStorage.setItem(name, stored);
      else localStorage.removeItem(name);
    }
  } catch {
    throw new Error("this browser refused to store the settings");
  }
}

export function clearSettings() {
  try {
    for (const key of ["token", "acToken", "relay", "images", "details", "hidden", "limit", "store"]) {
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
    throw new Error(
      res.ok
        ? "the reply was not JSON — the relay may be returning a page"
        : `store returned ${res.status}`
    );
  }

  /* A failing status usually still carries a useful explanation in the body,
     so prefer that over the bare status code. */
  if (!res.ok && !json.error && !json.errors) {
    throw new Error(`store returned ${res.status}`);
  }

  return json;
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

  /* Walking newest-first means the first time a channel appears is its latest. */
  const byChannel = new Map();
  for (const b of builds) {
    for (const name of b.channels) {
      if (byChannel.has(name)) continue;
      byChannel.set(name, {
        name,
        group: name === "LIVE" ? "PRIMARY" : "CUSTOM",
        version: b.version,
        versionCode: b.versionCode,
        releasedAt: b.releasedAt,
      });
    }
  }

  const channels = [...byChannel.values()];
  const live = channels.find((c) => c.name === "LIVE") ?? channels[0] ?? null;

  return { builds, channels, live, newest: builds[0] ?? null };
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
  const { builds, channels, live, newest } = await fetchHistory(app.id);

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

  /* The OS requirement rides along as a dependency config rather than a field. */
  const deps =
    update.application?.latest_available_binary?.dependency_configs?.edges ?? [];
  const requiredOs = deps
    .map((e) => e.node)
    .find((n) => /required_os_version/i.test(n?.identifier ?? ""))?.version;

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
    sha256: binary.sha256 ?? null,
    checksum: binary.checksum_hash ?? null,
    certSignature: binary.apk_cert_signature ?? null,
    permissions: binary.permissions ?? [],
    updateRequired:
      update.application?.latest_available_binary?.is_update_required ?? null,
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

/**
 * The store's own download endpoint for one binary.
 *
 * Downloads authenticate with the account token (`oc_ac_at`), not the one every
 * other request here uses. It goes straight to Meta's CDN rather than through
 * the relay — this is a file, not JSON. Meta decides whether to serve it: the
 * account has to be entitled to the app, so this is not a way around ownership.
 */
export function downloadURL(binaryId) {
  const { acToken } = loadSettings();
  return `https://securecdn.oculus.com/binaries/download/?${new URLSearchParams({
    id: String(binaryId),
    access_token: acToken,
  })}`;
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
