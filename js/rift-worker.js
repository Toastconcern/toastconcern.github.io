/* MetaDB Rift downloader — the whole download, off the page's thread.

   app.js (downloadRiftBuild) works out what to fetch — the build's files, each with
   its segment URLs, already routed through the relay and signed (check.js,
   riftSegmentUrl) — and where it goes: a file picked in a save dialog (Chrome, Edge),
   or a MessageChannel port into js/download-sw.js, which streams it into the browser's
   own download (Firefox, Safari). This worker then fetches the segments a few at a
   time, inflates each, works out the CRC and writes the .zip as it goes, so the page
   does nothing but show progress — no lag, however big the build. Only the segments
   in flight are ever held.

   The .zip: stored entries (game files are already compressed), CRC-32 as the bytes
   pass, ZIP64 throughout (PC builds carry files and archives past 4 GB), each entry's
   CRC and size in a data descriptor after its data, so nothing is known in advance.

   Each segment is asked of Meta's CDN directly first (`directs`), and through the
   site's relay (`urls`, /dl) once a direct fetch has failed — the browser refusing a
   cross-site reply, or the CDN refusing the request — for the rest of the download.
   Every relay fetch is one Cloudflare request, so direct, when it works, costs none.

   Each segment is checked against its SHA-256 (`hashes`, from the manifest), as the
   desktop client's downloader does. Which bytes the hash covers — the stored
   (compressed) segment or the inflated one — is worked out on the first segment; if
   neither matches even after a second fetch, the hashes are taken to be something else
   and checking is switched off for the download rather than failing every segment.
   Once known, a mismatch is a corrupt segment: fetched again, and an error after three.

   Messages in:  { type: "start", files: [{ path, size, urls, directs, hashes }], parallel,
                   fflateUrl, target: { kind: "file", handle } | { kind: "port", port } }
   Messages out: { type: "progress", done, total, file, files, way },
                 { type: "done", way, verified }, { type: "error", message }
                 way: "direct" | "relay"; verified: "raw" | "inflated" | "off" */

/* CRC-32, eight bytes a step (slice-by-8). */
const CRC_TABLE = (() => {
  const t = new Uint32Array(8 * 256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  for (let n = 0; n < 256; n++) for (let k = 1; k < 8; k++) t[k * 256 + n] = (t[(k - 1) * 256 + n] >>> 8) ^ t[t[(k - 1) * 256 + n] & 0xff];
  return t;
})();
function crc32(crc, b) {
  const T = CRC_TABLE;
  let c = crc;
  let i = 0;
  const n = b.length;
  for (; i + 8 <= n; i += 8) {
    c ^= b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24);
    c =
      T[1792 + (c & 0xff)] ^ T[1536 + ((c >>> 8) & 0xff)] ^ T[1280 + ((c >>> 16) & 0xff)] ^ T[1024 + (c >>> 24)] ^
      T[768 + b[i + 4]] ^ T[512 + b[i + 5]] ^ T[256 + b[i + 6]] ^ T[b[i + 7]];
  }
  for (; i < n; i++) c = T[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return c >>> 0;
}

/** A ZIP64 writer over a sink ({ write(bytes), close() }): begin(name), data(bytes)…,
    end() per entry, then finish(). */
function zipWriter(sink) {
  const enc = new TextEncoder();
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const entries = [];
  let offset = 0n;
  let cur = null;
  /* The length is read first: a port sink hands the bytes' memory over to the download
     worker, after which they read as empty. */
  const put = async (bytes) => {
    const n = bytes.length;
    await sink.write(bytes);
    offset += BigInt(n);
  };
  const block = (size, fill) => {
    const b = new Uint8Array(size);
    fill(new DataView(b.buffer));
    return b;
  };
  return {
    async begin(name) {
      const nameBytes = enc.encode(name);
      cur = { name: nameBytes, offset, crc: 0xffffffff, size: 0n };
      entries.push(cur);
      const h = block(30 + nameBytes.length + 20, (v) => {
        v.setUint32(0, 0x04034b50, true);
        v.setUint16(4, 45, true); // version needed: ZIP64
        v.setUint16(6, 0x0808, true); // data descriptor follows; UTF-8 names
        v.setUint16(8, 0, true); // stored
        v.setUint16(10, dosTime, true);
        v.setUint16(12, dosDate, true);
        v.setUint32(18, 0xffffffff, true);
        v.setUint32(22, 0xffffffff, true);
        v.setUint16(26, nameBytes.length, true);
        v.setUint16(28, 20, true);
        const x = 30 + nameBytes.length;
        v.setUint16(x, 0x0001, true); // ZIP64 extra: sizes come in the descriptor
        v.setUint16(x + 2, 16, true);
      });
      h.set(nameBytes, 30);
      await put(h);
    },
    async data(bytes) {
      cur.crc = crc32(cur.crc, bytes);
      cur.size += BigInt(bytes.length);
      await put(bytes);
    },
    async end() {
      cur.crc = (cur.crc ^ 0xffffffff) >>> 0;
      await put(
        block(24, (v) => {
          v.setUint32(0, 0x08074b50, true);
          v.setUint32(4, cur.crc, true);
          v.setBigUint64(8, cur.size, true);
          v.setBigUint64(16, cur.size, true);
        })
      );
    },
    async finish() {
      const cdStart = offset;
      for (const e of entries) {
        const h = block(46 + e.name.length + 28, (v) => {
          v.setUint32(0, 0x02014b50, true);
          v.setUint16(4, 45, true);
          v.setUint16(6, 45, true);
          v.setUint16(8, 0x0808, true);
          v.setUint16(12, dosTime, true);
          v.setUint16(14, dosDate, true);
          v.setUint32(16, e.crc, true);
          v.setUint32(20, 0xffffffff, true);
          v.setUint32(24, 0xffffffff, true);
          v.setUint16(28, e.name.length, true);
          v.setUint16(30, 28, true);
          v.setUint32(42, 0xffffffff, true);
          const x = 46 + e.name.length;
          v.setUint16(x, 0x0001, true);
          v.setUint16(x + 2, 24, true);
          v.setBigUint64(x + 4, e.size, true);
          v.setBigUint64(x + 12, e.size, true);
          v.setBigUint64(x + 20, e.offset, true);
        });
        h.set(e.name, 46);
        await put(h);
      }
      const cdSize = offset - cdStart;
      const z64At = offset;
      const count = BigInt(entries.length);
      await put(
        block(56 + 20 + 22, (v) => {
          v.setUint32(0, 0x06064b50, true); // ZIP64 end of central directory
          v.setBigUint64(4, 44n, true);
          v.setUint16(12, 45, true);
          v.setUint16(14, 45, true);
          v.setBigUint64(24, count, true);
          v.setBigUint64(32, count, true);
          v.setBigUint64(40, cdSize, true);
          v.setBigUint64(48, cdStart, true);
          v.setUint32(56, 0x07064b50, true); // its locator
          v.setBigUint64(64, z64At, true);
          v.setUint32(72, 1, true);
          v.setUint32(76, 0x06054b50, true); // the classic end record, pointing at ZIP64
          v.setUint16(80, 0xffff, true);
          v.setUint16(82, 0xffff, true);
          v.setUint16(84, 0xffff, true);
          v.setUint16(86, 0xffff, true);
          v.setUint32(88, 0xffffffff, true);
          v.setUint32(92, 0xffffffff, true);
        })
      );
      await sink.close();
    },
  };
}

/* One segment inflated: the browser's own decompressor (zlib, else gzip, else raw
   deflate), or fflate where there is none. */
let fflateUrl = "";
let fflate = null;
async function inflate(raw) {
  if (typeof DecompressionStream === "function") {
    for (const format of ["deflate", "gzip", "deflate-raw"]) {
      try {
        return new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream(format))).arrayBuffer());
      } catch {}
    }
  }
  fflate ??= await import(fflateUrl);
  try {
    return fflate.unzlibSync(raw);
  } catch {
    try {
      return fflate.gunzipSync(raw);
    } catch {
      return fflate.inflateSync(raw);
    }
  }
}

/* Direct from the CDN until it fails once; then the relay for the rest. */
let direct = true;
/* Which bytes a segment's SHA-256 covers: null until the first segment says, then
   "raw", "inflated", or "off" (neither — not checked). */
let verify = null;
let verifyMisses = 0;

const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
const sha256 = async (bytes) => hex(await crypto.subtle.digest("SHA-256", bytes));
const canHash = typeof crypto !== "undefined" && Boolean(crypto.subtle);

async function getBytes(seg) {
  if (direct && seg.direct) {
    try {
      const res = await fetch(seg.direct, { mode: "cors", credentials: "omit" });
      if (res.ok) return new Uint8Array(await res.arrayBuffer());
    } catch {}
    direct = false;
  }
  const res = await fetch(seg.url);
  if (!res.ok) throw new Error(`a segment was refused (HTTP ${res.status})`);
  return new Uint8Array(await res.arrayBuffer());
}

/* The segment, inflated, or throws once its hash is known to be wrong. */
async function checkedSegment(seg) {
  const raw = await getBytes(seg);
  const want = canHash && seg.sha256 ? String(seg.sha256).toLowerCase() : null;
  if (!want || verify === "off") return inflate(raw);
  if (verify === "raw") {
    if ((await sha256(raw)) !== want) throw new Error("a segment failed its SHA-256 check");
    return inflate(raw);
  }
  const out = await inflate(raw);
  if (verify === "inflated") {
    if ((await sha256(out)) !== want) throw new Error("a segment failed its SHA-256 check");
    return out;
  }
  /* Not known yet: whichever matches decides it for the whole download. */
  if ((await sha256(raw)) === want) verify = "raw";
  else if ((await sha256(out)) === want) verify = "inflated";
  else if (++verifyMisses >= 2) verify = "off";
  else throw new Error("a segment failed its SHA-256 check");
  return out;
}

async function fetchSegment(seg) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await checkedSegment(seg);
    } catch (err) {
      if (attempt >= 3) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

/* The two places a .zip goes. A picked file is written directly. A port feeds
   js/download-sw.js, which acknowledges each chunk once its stream has room. */
async function fileSink(handle) {
  const w = await handle.createWritable();
  return { write: (b) => w.write(b), close: () => w.close(), abort: () => w.abort().catch(() => {}) };
}
function portSink(port) {
  let credits = 0;
  let cancelled = false;
  const waiting = [];
  port.onmessage = ({ data }) => {
    if (data === "ack") {
      const next = waiting.shift();
      if (next) next();
      else credits++;
    } else if (data === "cancel") {
      cancelled = true;
      while (waiting.length) waiting.shift()();
    }
  };
  return {
    async write(bytes) {
      if (cancelled) throw new Error("the download was cancelled in the browser");
      const copy = bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength ? bytes : bytes.slice();
      port.postMessage(copy.buffer, [copy.buffer]);
      if (credits > 0) credits--;
      else await new Promise((resolve) => waiting.push(resolve));
      if (cancelled) throw new Error("the download was cancelled in the browser");
    },
    async close() {
      port.postMessage({ done: true });
    },
    abort() {
      port.postMessage({ abort: true });
    },
  };
}

self.onmessage = async ({ data }) => {
  if (data?.type !== "start") return;
  fflateUrl = data.fflateUrl;
  let sink = null;
  try {
    sink = data.target.kind === "file" ? await fileSink(data.target.handle) : portSink(data.target.port);
    const files = data.files;
    const parallel = Math.max(1, data.parallel || 8);
    const urls = files.flatMap((f) =>
      f.urls.map((url, i) => ({ url, direct: f.directs?.[i] ?? null, sha256: f.hashes?.[i] ?? null }))
    );
    const total = files.reduce((n, f) => n + (f.size || 0), 0) || 1;

    /* Segments up to `parallel` past the one being written are fetched now; a failed
       one is caught here and thrown where it is written. */
    const ahead = new Map();
    let started = 0;
    const fill = (upto) => {
      while (started < urls.length && started < upto) {
        const p = fetchSegment(urls[started]);
        p.catch(() => {});
        ahead.set(started++, p);
      }
    };

    const zip = zipWriter(sink);
    let job = 0;
    let done = 0;
    let shown = 0;
    for (const [i, f] of files.entries()) {
      await zip.begin(f.path);
      for (let s = 0; s < f.urls.length; s++) {
        fill(job + parallel);
        const bytes = await ahead.get(job);
        ahead.delete(job++);
        done += bytes.length; // before the write hands the bytes away
        await zip.data(bytes);
        if (Date.now() - shown > 250) {
          shown = Date.now();
          self.postMessage({ type: "progress", done, total, file: i + 1, files: files.length, way: direct ? "direct" : "relay" });
        }
      }
      await zip.end();
    }
    await zip.finish();
    self.postMessage({ type: "done", way: direct ? "direct" : "relay", verified: verify ?? "off" });
  } catch (err) {
    sink?.abort();
    self.postMessage({ type: "error", message: err?.message || String(err) });
  }
};
