/* adb.js — talking to a headset instead of to the store.
 *
 * Everything else in this project reads Meta's servers. This file is the one
 * exception: it reaches a headset the reader has in front of them, so an app
 * already installed can be put back to an older build.
 *
 * It does not speak ADB itself. The adb already on the reader's machine does
 * that, and `tools/adb-bridge.mjs` puts a small HTTP front end on it; this is
 * the client for that. Going through the real adb rather than driving USB from
 * the page settles three things at once:
 *
 *   - No second key. WebUSB has to authenticate with a key of its own, which
 *     the headset has never seen, so every attempt waits on an "Allow USB
 *     debugging?" prompt inside the headset. The machine's adb is already
 *     trusted, and its key is the one the headset knows.
 *   - Wireless comes free. `adb connect` does it; a browser cannot open the raw
 *     TCP socket wireless ADB needs.
 *   - No browser limit. Driving USB from a page is Chrome and Edge only.
 *
 * The cost is that the bridge has to be running and adb has to be installed —
 * which anyone sideloading onto a headset already has.
 */

/* Where the bridge listens. `?bridge=` overrides it for anyone who moved it. */
export const BRIDGE =
  new URLSearchParams(location.search).get("bridge") || "http://127.0.0.1:8789";

async function call(route, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${BRIDGE}${route}`, {
      method,
      body,
      headers: body ? { "Content-Type": "application/octet-stream" } : undefined,
    });
  } catch {
    throw new Error(
      "the bridge is not answering — start it with `node tools/adb-bridge.mjs`"
    );
  }

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`the bridge replied with ${res.status}`);
  }
  if (!res.ok) throw new Error(json.error ?? `the bridge replied with ${res.status}`);
  return json;
}

/** Every headset adb can currently see. */
export async function listDevices() {
  const { devices } = await call("/devices");
  return devices;
}

/* Pick a headset adb is ready to talk to. `unauthorized` is worth naming: it
   means adb itself has not been allowed yet, which is a prompt inside the
   headset and the one thing neither the bridge nor the page can do for you. */
function usable(devices, wanted) {
  const found = wanted
    ? devices.find((d) => d.serial === wanted)
    : devices.find((d) => d.state === "device");

  if (!found) {
    if (devices.some((d) => d.state === "unauthorized")) {
      throw new Error(
        "the headset is connected but has not allowed this computer — put it " +
          "on and accept the debugging prompt, then try again"
      );
    }
    throw new Error(
      wanted
        ? `adb cannot see ${wanted}`
        : "adb cannot see a headset — check the cable, or connect wirelessly"
    );
  }
  if (found.state !== "device") {
    throw new Error(`the headset is ${found.state}, not ready`);
  }
  return { serial: found.serial, model: found.model, close() {} };
}

/**
 * Use whatever headset adb already has.
 *
 * Named for the button rather than the transport: by the time this runs adb has
 * done the connecting, over a cable or over the network.
 */
export async function connectUsb({ onStage } = {}) {
  onStage?.("Asking adb what it can see…");
  return usable(await listDevices());
}

/**
 * Pair with a headset that is showing a pairing code.
 *
 * Android's own wireless debugging: the headset shows an address, a port and
 * six digits, and this trades them for a key it will remember. Done once per
 * computer — after it, connecting needs only the address.
 *
 * The port on the pairing dialog is not the port you connect on afterwards.
 */
export async function pairDevice(address, code, { onStage } = {}) {
  const target = String(address).trim();
  if (!target) throw new Error("enter the address the pairing dialog shows");
  if (!/^\d{6}$/.test(String(code).trim())) {
    throw new Error("the pairing code is the six digits on the headset");
  }

  onStage?.(`Pairing with ${target}…`);
  const { message } = await call(
    `/pair?addr=${encodeURIComponent(target)}&code=${encodeURIComponent(String(code).trim())}`,
    { method: "POST" }
  );
  return message;
}

/** Reach a headset over the network, then use it. */
export async function connectWireless(_bridgeUrl, address, { onStage } = {}) {
  const target = String(address).trim();
  if (!target) throw new Error("enter the headset's address");

  onStage?.(`Connecting to ${target}…`);
  const { devices } = await call(`/connect?addr=${encodeURIComponent(target)}`, {
    method: "POST",
  });

  return usable(devices, target.includes(":") ? target : `${target}:5555`);
}

/** The headset's own name for itself, for the connected line. */
export async function deviceInfo(session) {
  return call(`/info?serial=${encodeURIComponent(session.serial)}`);
}

/** Every third-party package installed, with the version it is on. */
export async function installedApps(session) {
  const { apps } = await call(
    `/packages?serial=${encodeURIComponent(session.serial)}`
  );
  return apps;
}

/**
 * Put an APK on the headset.
 *
 * The bridge installs with `-r -d`, which allows a lower version code where the
 * build permits it. A store build that refuses anyway still needs the uninstall
 * the caller warns about — that is Android's rule, not something either end can
 * talk it out of.
 */
export async function installApk(session, blob, { onProgress } = {}) {
  onProgress?.("Sending the APK to adb…");
  const { message } = await call(
    `/install?serial=${encodeURIComponent(session.serial)}`,
    { method: "POST", body: blob }
  );
  onProgress?.(message || "Installed.");
}

/**
 * Put an expansion file where the app will look for it.
 *
 * An APK that shipped with an OBB installs perfectly well without one and then
 * sits there missing its assets, so the pair belongs together. Android expects
 * it at a fixed path under the package's own directory, named for the build it
 * belongs to.
 */
export async function pushObb(session, packageName, versionCode, blob, { onProgress } = {}) {
  const dest =
    `/sdcard/Android/obb/${packageName}/main.${versionCode}.${packageName}.obb`;
  onProgress?.("Sending the expansion file…");
  await call(
    `/push?serial=${encodeURIComponent(session.serial)}` +
      `&dest=${encodeURIComponent(dest)}`,
    { method: "POST", body: blob }
  );
}

/** Remove an app, and its data with it. */
export async function uninstall(session, packageName) {
  await call(
    `/uninstall?serial=${encodeURIComponent(session.serial)}` +
      `&package=${encodeURIComponent(packageName)}`,
    { method: "POST" }
  );
}
