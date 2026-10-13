// Publish the browser extension: node tools/extension-release.mjs  (from the repo root)
//
// Writes downloads/MetaDB-extension.json, which the extension's update check reads,
// from extension/manifest.json's version and the bullets under "## Extension X.Y" in
// CHANGELOG.md, then zips extension/ into downloads/MetaDB-extension.zip. It refuses
// when the changelog has no section for the version, so no release goes out unexplained.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

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
writeFileSync("downloads/MetaDB-extension.json", JSON.stringify({ version, built, changes }) + "\n");

rmSync("downloads/MetaDB-extension.zip", { force: true });
if (process.platform === "win32") {
  execFileSync("powershell", ["-NoProfile", "-Command", "Compress-Archive -Path extension\\* -DestinationPath downloads\\MetaDB-extension.zip"]);
} else {
  execFileSync("zip", ["-qr", "../downloads/MetaDB-extension.zip", "."], { cwd: "extension" });
}
console.log(`published MetaDB Sign-in ${version} (${changes.length} change${changes.length === 1 ? "" : "s"})`);
