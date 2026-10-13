#!/usr/bin/env bash
# Build MetaDB.apk with nothing but the Android SDK and a JDK — no Gradle.
#
#   ./build.sh            -> build/MetaDB.apk
#   DEBUG=1 ./build.sh    -> the same, debuggable, for testing with Chrome DevTools
#   SITE=<url> ./build.sh -> opens another copy of the site (testing)
#   PUBLISH=1 ./build.sh  -> the release, copied to ../downloads for the site to serve
#
# Needs: a JDK (javac, keytool) and the Android SDK with one platform and
# build-tools installed. Set ANDROID_HOME if the SDK is not in the usual place.
set -euo pipefail
cd "$(dirname "$0")"

SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [ -z "$SDK" ]; then
  for d in "$LOCALAPPDATA/Android/Sdk" "$HOME/Android/Sdk" "$HOME/Library/Android/sdk"; do
    [ -d "$d" ] && SDK="$d" && break
  done
fi
[ -d "$SDK" ] || { echo "Android SDK not found; set ANDROID_HOME" >&2; exit 1; }

BT="$SDK/build-tools/$(ls "$SDK/build-tools" | sort -V | tail -1)"
JAR="$SDK/platforms/$(ls "$SDK/platforms" | sort -V | tail -1)/android.jar"
EXE=""; [ -f "$BT/aapt2.exe" ] && EXE=".exe"
BAT=""; [ -f "$BT/d8.bat" ] && BAT=".bat"

rm -rf build && mkdir -p build/classes build/dex build/res

# 1. Resources and manifest
"$BT/aapt2$EXE" compile --dir res -o build/res/res.zip
# DEBUG=1 ./build.sh makes a debuggable build, so Chrome DevTools can inspect the page.
DEBUGFLAG=""; [ "${DEBUG:-}" = "1" ] && DEBUGFLAG="--debug-mode"
# SITE=<url> ./build.sh points the app at another copy of the site, e.g. one served
# from a PC over `adb reverse` for testing. The default is the published site.
MANIFEST=AndroidManifest.xml
if [ -n "${SITE:-}" ]; then
  sed "s|https://metadb.toastconcern.dev/|$SITE|" AndroidManifest.xml > build/AndroidManifest.xml
  MANIFEST=build/AndroidManifest.xml
fi
"$BT/aapt2$EXE" link -o build/base.apk -I "$JAR" --manifest "$MANIFEST" \
  --min-sdk-version 29 --target-sdk-version 34 $DEBUGFLAG build/res/res.zip

# 2. Java -> classes -> dex
javac -source 17 -target 17 -encoding UTF-8 -Xlint:-options \
  -cp "$JAR" -d build/classes $(find src -name '*.java')
"$BT/d8$BAT" --min-api 29 --lib "$JAR" --output build/dex $(find build/classes -name '*.class')

# 3. Put the dex in, align, sign
(cd build/dex && "$BT/aapt$EXE" add ../base.apk classes.dex >/dev/null)
"$BT/zipalign$EXE" -f 4 build/base.apk build/aligned.apk

# A local signing key, made once and never committed. Anyone building from
# source gets their own; an update must be signed with the same key as before.
KS="${METADB_KEYSTORE:-metadb.keystore}"
if [ ! -f "$KS" ]; then
  keytool -genkeypair -keystore "$KS" -storepass metadb -keypass metadb -alias metadb \
    -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=MetaDB" >/dev/null
fi
"$BT/apksigner$BAT" sign --ks "$KS" --ks-pass pass:metadb --key-pass pass:metadb \
  --out build/MetaDB.apk build/aligned.apk

echo "built $(pwd)/build/MetaDB.apk"

# PUBLISH=1 ./build.sh also puts the build where the site serves it — the Get the
# app screen links to ../downloads/MetaDB.apk and reads its version from the .json.
# Only the real thing is published: not a debug build, not one aimed at a test site.
if [ "${PUBLISH:-}" = "1" ]; then
  if [ "${DEBUG:-}" = "1" ] || [ -n "${SITE:-}" ]; then
    echo "PUBLISH refuses a DEBUG or SITE build — build the release on its own" >&2
    exit 1
  fi
  mkdir -p ../downloads
  cp build/MetaDB.apk ../downloads/MetaDB.apk
  VNAME=$(grep -o 'android:versionName="[^"]*"' AndroidManifest.xml | cut -d'"' -f2)
  VCODE=$(grep -o 'android:versionCode="[^"]*"' AndroidManifest.xml | cut -d'"' -f2)
  SIZE=$(wc -c < build/MetaDB.apk | tr -d ' ')
  # "What's new": the bullets under "## App $VNAME" in ../CHANGELOG.md, as a JSON list.
  CHANGES=$(awk -v head="## App $VNAME " '
    index($0, head) == 1 { on = 1; next }
    on && /^## / { exit }
    on && /^- / { s = substr($0, 3); gsub(/\\/, "\\\\", s); gsub(/"/, "\\\"", s); printf "%s\"%s\"", (n++ ? "," : ""), s }
  ' ../CHANGELOG.md)
  if [ -z "$CHANGES" ]; then
    echo "CHANGELOG.md has no '## App $VNAME' section — add one before publishing" >&2
    exit 1
  fi
  printf '{"version":"%s","versionCode":%s,"size":%s,"built":"%s","changes":[%s]}\n' \
    "$VNAME" "$VCODE" "$SIZE" "$(date -u +%Y-%m-%d)" "$CHANGES" > ../downloads/MetaDB.json
  echo "published ../downloads/MetaDB.apk ($VNAME, $SIZE bytes)"
fi
