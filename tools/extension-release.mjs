// Publish the browser extension: node tools/extension-release.mjs  (from the repo root)
//
// Writes downloads/MetaDB-extension.json, which the extension's update check reads,
// from extension/manifest.json's version and the bullets under "## Extension X.Y" in
// CHANGELOG.md, then zips extension/ into downloads/MetaDB-extension.zip. It refuses
// when the changelog has no section for the version, so no release goes out unexplained.
//
// The version file is signed. The extension carries the public key and ignores update
// information that does not verify, and checks the zip it downloads against the signed
// SHA-256 and size, so no one but the holder of the private key can put an update in
// front of it — not even someone who controls the site. The private key never goes in
// the repo: it is read from %USERPROFILE%/.metadb/extension-signing-key.pem (or the
// METADB_EXTENSION_KEY path). Lose it and installed extensions can only be moved to a
// new key by hand, so keep a copy somewhere safe.
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash, createPrivateKey, sign } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";

const KEY = process.env.METADB_EXTENSION_KEY ?? join(homedir(), ".metadb", "extension-signing-key.pem");
if (!existsSync(KEY)) {
  console.error(`No signing key at ${KEY} — updates must be signed, so nothing was published`);
  process.exit(1);
}

const { version } = JSON.parse(readFileSync("extension/manifest.json", "utf8"));
const log = readFileSync("CHANGELOG.md", "utf8").split(/\r?\n/);

const start = log.findIndex((l) => l.startsWith(`## Extension ${version} `) || l === `## Extension ${version}`);
if (start < 0) {
  console.error(`CHANGELOG.md has no "## Extension ${version}" section — add one before publishing`);
  process.exit(1);
}
const changes = [];
for (const line of log.slice(start + 1)) {
  if (line.startsWith("## ")) break;
  if (line.startsWith("- ")) changes.push(line.slice(2).trim());
  else if (/^\s+\S/.test(line) && changes.length) changes[changes.length - 1] += " " + line.trim();
}

const built = new Date().toISOString().slice(0, 10);

rmSync("downloads/MetaDB-extension.zip", { force: true });
if (process.platform === "win32") {
  execFileSync("powershell", ["-NoProfile", "-Command", "Compress-Archive -Path extension\\* -DestinationPath downloads\\MetaDB-extension.zip"]);
} else {
  execFileSync("zip", ["-qr", "../downloads/MetaDB-extension.zip", "."], { cwd: "extension" });
}
/* What is signed: the exact text of the payload, so nothing is lost to how JSON is
   re-serialised. ECDSA P-256 with SHA-256, in the raw (r||s) form WebCrypto verifies.
   The plain copy beside it is for 1.1 and older, which do not check signatures. */
const zip = readFileSync("downloads/MetaDB-extension.zip");
const payload = JSON.stringify({ version, built, changes, sha256: createHash("sha256").update(zip).digest("hex"), size: zip.length });
const signature = sign("sha256", Buffer.from(payload), { key: createPrivateKey(readFileSync(KEY)), dsaEncoding: "ieee-p1363" }).toString("base64");
writeFileSync("downloads/MetaDB-extension.json", JSON.stringify({ version, built, changes, signed: { payload, signature } }) + "\n");

console.log(`published MetaDB Sign-in ${version} (${changes.length} change${changes.length === 1 ? "" : "s"})`);
