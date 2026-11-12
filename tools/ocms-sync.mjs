/* Keeps data/ocms-headers-latest.json at the newest OCMS a headset of yours runs.
 *
 *   node tools/ocms-sync.mjs           update it from any headset on adb
 *   node tools/ocms-sync.mjs --check   say what would change, write nothing
 *
 * `node tools/serve.mjs` runs this at start and every 10 minutes (on by default;
 * --no-ocms-sync turns it off), so plugging in an updated headset is enough.
 *
 * data/ocms-headers.json is the set you edit by hand, and stays what every request uses
 * by default; this never touches it. The latest set it writes is used only for requests
 * signed with a person's own token, and only while it is newer than the hand-set one
 * (tools/ocms-pick.mjs).
 *
 * OCMS (the headset's app manager) updates with the OS, not through the store, and no
 * Meta API reports its version, so the only reliable source of the newest values is a
 * headset. Read off each one connected, with the same commands the file was always
 * filled in from by hand:
 *   dumpsys package com.oculus.ocms   versionName -> FBAV, versionCode -> FBBV
 *   getprop ro.build.version.incremental  -> X-Build-Version-Incremental
 *   getprop ro.vros.build.version         -> FBHV
 * Values only ever move forward, from whichever of the two files is newer. With no
 * headset (or no adb) nothing is written.
 */
import { execFile } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

import { isNewer } from "./ocms-pick.mjs";

const FIXED = fileURLToPath(new URL("../data/ocms-headers.json", import.meta.url));
const FILE = fileURLToPath(new URL("../data/ocms-headers-latest.json", import.meta.url));
const ADB = process.env.ADB || "adb";

function runAdb(args) {
  return new Promise((resolve, reject) =>
    execFile(ADB, args, { timeout: 15000, maxBuffer: 1 << 24 }, (err, stdout) => (err ? reject(err) : resolve(stdout)))
  );
}

const num = (s) => (/^\d+$/.test(String(s ?? "").trim()) ? BigInt(String(s).trim()) : -1n);

/** What one headset runs: { ocmsName, ocmsCode, incremental, hv }; missing parts are null. */
async function readHeadset(adb, serial) {
  const shell = (...a) => adb(["-s", serial, "shell", ...a]).then((s) => s.trim()).catch(() => "");
  const dump = await shell("dumpsys", "package", "com.oculus.ocms");
  /* An updated system app lists two packages, the image's and the update: keep the higher. */
  let best = null;
  for (const m of dump.matchAll(/versionCode=(\d+)[\s\S]*?versionName=(\S+)/g)) {
    if (!best || BigInt(m[1]) > BigInt(best.code)) best = { code: m[1], name: m[2] };
  }
  return {
    serial,
    ocmsName: best?.name ?? null,
    ocmsCode: best?.code ?? null,
    incremental: (await shell("getprop", "ro.build.version.incremental")) || null,
    hv: (await shell("getprop", "ro.vros.build.version")) || null,
  };
}

/**
 * Compare the file with every connected headset and move each value forward.
 * Resolves to { headsets, changes: [text], headers, written }. Never throws: no adb,
 * no headset and an unreadable headset all just mean no changes.
 */
export async function syncOcms({ write = true, adb = runAdb, log = () => {} } = {}) {
  const fixed = JSON.parse(readFileSync(FIXED, "utf8"));
  let latest = null;
  try {
    latest = JSON.parse(readFileSync(FILE, "utf8"));
  } catch {}
  /* Start from whichever is newer, so a hand edit past the last sync is kept. */
  const headers = latest && !isNewer(fixed, latest) ? latest : fixed;
  let serials = [];
  try {
    serials = (await adb(["devices"]))
      .split("\n")
      .slice(1)
      .map((l) => l.trim().split(/\s+/))
      .filter(([s, state]) => s && state === "device")
      .map(([s]) => s);
  } catch (err) {
    log(err.code === "ENOENT" ? "OCMS sync: adb not found; the OCMS headers stay as they are." : `OCMS sync: adb failed (${err.message.split("\n")[0]}).`);
    return { headsets: 0, changes: [], headers, written: false };
  }
  if (!serials.length) return { headsets: 0, changes: [], headers, written: false };

  const seen = await Promise.all(serials.map((s) => readHeadset(adb, s)));
  let ua = headers["User-Agent"];
  const changes = [];
  const field = (name) => ua.match(new RegExp(`${name}/([^;\\]]*)`))?.[1] ?? null;
  const setField = (name, value) => (ua = ua.replace(new RegExp(`(${name}/)[^;\\]]*`), `$1${value}`));

  /* OCMS: the headset with the highest versionCode, if its version beats FBAV (the
     version name, since that is what gets set by hand; FBBV can lag behind it). */
  const top = seen.filter((h) => h.ocmsCode && h.ocmsName).sort((a, b) => (num(b.ocmsCode) > num(a.ocmsCode) ? 1 : -1))[0];
  const asHeaders = (name) => ({ "User-Agent": `FBAV/${name};` });
  const sameName = top && top.ocmsName === field("FBAV");
  if (top && (isNewer(asHeaders(top.ocmsName), asHeaders(field("FBAV"))) || (sameName && num(top.ocmsCode) !== num(field("FBBV"))))) {
    changes.push(`OCMS ${field("FBAV")} (${field("FBBV")}) -> ${top.ocmsName} (${top.ocmsCode})`);
    setField("FBAV", top.ocmsName);
    setField("FBBV", top.ocmsCode);
  }
  const hv = seen.map((h) => h.hv).filter((v) => /^\d+$/.test(v ?? "")).sort((a, b) => (num(b) > num(a) ? 1 : -1))[0];
  if (hv && num(hv) > num(field("FBHV"))) {
    changes.push(`FBHV ${field("FBHV")} -> ${hv}`);
    setField("FBHV", hv);
  }
  const inc = seen.map((h) => h.incremental).filter((v) => /^\d+$/.test(v ?? "")).sort((a, b) => (num(b) > num(a) ? 1 : -1))[0];
  const next = { ...headers, "User-Agent": ua };
  if (inc && num(inc) > num(headers["X-Build-Version-Incremental"])) {
    changes.push(`incremental ${headers["X-Build-Version-Incremental"]} -> ${inc}`);
    next["X-Build-Version-Incremental"] = inc;
  }

  let written = false;
  if (changes.length && write) {
    writeFileSync(FILE, JSON.stringify(next, null, 2) + "\n");
    written = true;
  }
  return { headsets: seen.length, changes, headers: changes.length ? next : headers, written };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes("--check");
  const r = await syncOcms({ write: !check, log: console.log });
  if (!r.headsets) console.log("No headset on adb — nothing changed.");
  else if (!r.changes.length) console.log(`The latest OCMS headers are already as new as the headset${r.headsets > 1 ? "s" : ""} (${r.headsets}).`);
  else {
    for (const c of r.changes) console.log(`  ${c}`);
    console.log(check ? "(--check: nothing written)" : "data/ocms-headers-latest.json updated (used for signed-in requests). Push it to use it on the live site.");
  }
}
