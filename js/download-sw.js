/* MetaDB download streamer — a service worker with one job: hand a file the page is
   still building to the browser's own download, piece by piece, so a large download is
   written to disk as it arrives instead of being held in memory first.

   The page opens a stream with a "download" message (an id, a file name, and a
   MessageChannel port), sends the file's bytes down that port, and points a hidden
   frame at js/dl/<id>/<name>; this worker answers that request with the stream as an
   attachment. Each chunk is acknowledged once the stream has room, which is what keeps
   the page from running ahead of the disk. Used where the page cannot write a file
   itself (Firefox, Safari); Chrome and Edge save through a save dialog instead.
   Registered by app.js (riftZipSink) with scope js/dl/, so it touches nothing else. */

const streams = new Map();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("message", (e) => {
  const d = e.data;
  if (!d || d.type !== "download" || !e.ports[0]) return; // pings keep the worker awake
  const port = e.ports[0];
  let owed = false;
  const stream = new ReadableStream(
    {
      start(controller) {
        port.onmessage = ({ data }) => {
          if (data && data.done) return controller.close();
          if (data && data.abort) return controller.error(new Error("cancelled"));
          controller.enqueue(new Uint8Array(data));
          if (controller.desiredSize > 0) port.postMessage("ack");
          else owed = true;
        };
      },
      pull() {
        if (owed) {
          owed = false;
          port.postMessage("ack");
        }
      },
      cancel() {
        port.postMessage("cancel");
      },
    },
    { highWaterMark: 8 }
  );
  streams.set(String(d.id), { stream, name: String(d.name || "download.zip") });
  port.postMessage("ready");
});

self.addEventListener("fetch", (e) => {
  const m = new URL(e.request.url).pathname.match(/\/dl\/([^/]+)\//);
  const entry = m && streams.get(m[1]);
  if (!entry) return;
  streams.delete(m[1]);
  e.respondWith(
    new Response(entry.stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(entry.name)}`,
        "Cache-Control": "no-store",
      },
    })
  );
});
