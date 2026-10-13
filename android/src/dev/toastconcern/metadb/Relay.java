package dev.toastconcern.metadb;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import android.content.Context;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * The same relay as tools/relay.mjs, inside the app.
 *
 * graph.oculus.com only lets facebook.com read its replies, so the page cannot
 * call it directly. This listens on 127.0.0.1, fetches the URL it is handed in
 * ?url=, and passes the reply back with headers the page is allowed to read.
 * Only oculus.com URLs are forwarded, and it never adds a token of its own —
 * it carries whatever the page sent.
 */
final class Relay {
    static final int PORT = 8788;

    /**
     * Every request goes out as the headset's own app manager (OCMS) sends it: its
     * User-Agent, which carries the OCMS version (FBAV/1048.0.0.115.1326, build
     * FBBV/584111364), and the OS build header beside it. Read off a Quest 3: OCMS
     * from {@code dumpsys package com.oculus.ocms}, the rest from getprop
     * (ro.build.version.incremental, ro.vros.build.version for FBHV). Update all
     * three relays together: this, tools/relay.mjs and functions/api.js.
     */
    static final String OCMS_UA =
            "Dalvik/2.1.0 (Linux; U; Android 14; Quest 3 Build/UP1A.231005.007.A1) "
                    + "[FBAN/OculusOCMS;FBAV/1048.0.0.115.1326;FBCR/null;FBDV/Quest 3;FBHV/209;"
                    + "FBLC/en_US;FBSV/14;FBSBT/user;FBBD/oculus;FBBV/584111364;"
                    + "FBCA/arm64-v8a:armeabi-v7a:armeabi;FBMF/Oculus;FBPN/com.oculus.ocms;"
                    + "FBDW/null;FBVM/null;]";

    /** The headset OS build OCMS names with it (Build.VERSION.INCREMENTAL). */
    static final String OCMS_BUILD = "52641960021500520";

    /**
     * The language replies are written in: dates, number formats and store text in
     * US English. It does not pick the currency; Meta prices by where the request
     * comes from.
     */
    static final String LANGUAGE = "en-US,en;q=0.6";

    private static final Pattern ALLOWED =
            Pattern.compile("^https://(graph|www|securecdn(-[a-z0-9-]+)?)\\.oculus\\.com/.*");

    private static volatile boolean started;

    /*
     * Headers the site set (MetaDBApp.setRelayHeaders), sent in place of the
     * built-in ones above, so an OCMS version bump is a site change rather than a
     * new APK. Kept across launches, so the relay has them before the page loads.
     * The built-in ones stay as the fallback for a site that never sets any.
     */
    private static volatile Map<String, String> custom = new HashMap<>();
    private static final Pattern HEADER_NAME = Pattern.compile("^[A-Za-z0-9-]{1,64}$");
    /* Ones the relay decides itself, or that would change what is sent and to whom. */
    private static final Set<String> FIXED = new HashSet<>(Arrays.asList(
            "host", "content-length", "content-type", "cookie", "authorization", "connection",
            "transfer-encoding", "accept", "accept-encoding", "origin", "referer"));

    /** The headers the site set last time, if any. Called before start(). */
    static void loadHeaders(Context c) {
        String saved = c.getSharedPreferences("relay", Context.MODE_PRIVATE).getString("headers", null);
        if (saved == null) return;
        try {
            custom = parseHeaders(saved);
        } catch (JSONException ignored) {
        }
    }

    /** Replace the site-set headers. Refuses the lot if any one is not allowed. */
    static boolean setHeaders(Context c, String json) {
        try {
            Map<String, String> m = parseHeaders(json);
            custom = m;
            c.getSharedPreferences("relay", Context.MODE_PRIVATE).edit().putString("headers", json).apply();
            return true;
        } catch (JSONException e) {
            return false;
        }
    }

    private static Map<String, String> parseHeaders(String json) throws JSONException {
        JSONObject o = new JSONObject(json);
        Map<String, String> m = new HashMap<>();
        for (Iterator<String> it = o.keys(); it.hasNext(); ) {
            String k = it.next();
            String v = o.getString(k);
            if (!HEADER_NAME.matcher(k).matches() || FIXED.contains(k.toLowerCase(Locale.ROOT))
                    || v.length() > 1024 || v.indexOf('\r') >= 0 || v.indexOf('\n') >= 0) {
                throw new JSONException("header not allowed: " + k);
            }
            m.put(k, v);
        }
        return m;
    }

    /** The OCMS headers on one request: the built-in ones, then whatever the site set over them. */
    static void applyHeaders(HttpURLConnection up) {
        up.setRequestProperty("User-Agent", OCMS_UA);
        up.setRequestProperty("X-Build-Version-Incremental", OCMS_BUILD);
        up.setRequestProperty("Accept-Language", LANGUAGE);
        for (Map.Entry<String, String> e : custom.entrySet()) up.setRequestProperty(e.getKey(), e.getValue());
    }

    /** The User-Agent in use, for downloads handed to Android's DownloadManager. */
    static String userAgent() {
        String ua = custom.get("User-Agent");
        return ua != null ? ua : OCMS_UA;
    }

    private Relay() {}

    /** Start once. If the port is taken, assume a relay is already there. */
    static synchronized void start() {
        if (started) return;
        started = true;
        Thread t = new Thread(() -> {
            try (ServerSocket server =
                         new ServerSocket(PORT, 50, InetAddress.getByName("127.0.0.1"))) {
                while (true) {
                    Socket s = server.accept();
                    new Thread(() -> handle(s), "relay-conn").start();
                }
            } catch (IOException e) {
                // Port in use or closed; nothing more to do.
            }
        }, "relay");
        t.setDaemon(true);
        t.start();
    }

    private static void handle(Socket s) {
        try (Socket sock = s;
             InputStream in = sock.getInputStream();
             OutputStream out = sock.getOutputStream()) {

            String line = readLine(in);
            if (line == null || line.isEmpty()) return;
            String[] parts = line.split(" ");
            String method = parts[0];
            String path = parts.length > 1 ? parts[1] : "/";

            Map<String, String> headers = new HashMap<>();
            String h;
            while ((h = readLine(in)) != null && !h.isEmpty()) {
                int c = h.indexOf(':');
                if (c > 0) headers.put(h.substring(0, c).trim().toLowerCase(Locale.ROOT), h.substring(c + 1).trim());
            }

            if (method.equals("OPTIONS")) {
                respond(out, 204, "text/plain", null, new byte[0]);
                return;
            }

            String target = query(path, "url");
            if (target == null) {
                respond(out, 400, "application/json", null, error("no url parameter"));
                return;
            }
            if (!ALLOWED.matcher(target).matches()) {
                respond(out, 403, "application/json", null, error("only oculus.com URLs are relayed"));
                return;
            }

            byte[] body = null;
            if (method.equals("POST")) {
                int len = Integer.parseInt(headers.getOrDefault("content-length", "0"));
                body = readExactly(in, len);
            }

            boolean download = new URL(target).getHost().startsWith("securecdn");
            HttpURLConnection up = (HttpURLConnection) new URL(target).openConnection();
            up.setConnectTimeout(30_000);
            up.setReadTimeout(300_000);
            applyHeaders(up);
            if (download) {
                up.setRequestProperty("Accept", "*/*");
                // Ask for the bytes as they are, so the length still holds.
                up.setRequestProperty("Accept-Encoding", "identity");
            } else {
                up.setRequestProperty("Accept", "application/json");
            }
            if (body != null) {
                up.setRequestMethod("POST");
                up.setDoOutput(true);
                up.setRequestProperty("Content-Type",
                        headers.getOrDefault("content-type", "application/x-www-form-urlencoded"));
                try (OutputStream o = up.getOutputStream()) {
                    o.write(body);
                }
            }

            int status = up.getResponseCode();
            InputStream upIn = status >= 400 ? up.getErrorStream() : up.getInputStream();
            String type = up.getContentType();
            if (type == null) type = download ? "application/octet-stream" : "application/json";
            String disposition = up.getHeaderField("Content-Disposition");

            if (download) {
                // Streamed: an APK can be gigabytes.
                long length = up.getContentLengthLong();
                writeHead(out, status, type, disposition, length);
                if (upIn != null) copy(upIn, out);
            } else {
                // Read whole, so the length sent is the length of what is sent.
                respond(out, status, type, disposition, upIn == null ? new byte[0] : readAll(upIn));
            }
        } catch (Exception e) {
            // The page gave up, or the store did. Either way the socket closes.
        }
    }

    private static void respond(OutputStream out, int status, String type, String disposition, byte[] body)
            throws IOException {
        writeHead(out, status, type, disposition, body.length);
        out.write(body);
        out.flush();
    }

    private static void writeHead(OutputStream out, int status, String type, String disposition, long length)
            throws IOException {
        StringBuilder b = new StringBuilder();
        b.append("HTTP/1.1 ").append(status).append(" OK\r\n");
        b.append("Access-Control-Allow-Origin: *\r\n");
        b.append("Access-Control-Allow-Headers: *\r\n");
        b.append("Access-Control-Allow-Private-Network: true\r\n");
        b.append("Content-Type: ").append(type).append("\r\n");
        if (disposition != null) b.append("Content-Disposition: ").append(disposition).append("\r\n");
        if (length >= 0) b.append("Content-Length: ").append(length).append("\r\n");
        b.append("Connection: close\r\n\r\n");
        out.write(b.toString().getBytes(StandardCharsets.ISO_8859_1));
    }

    private static byte[] error(String message) {
        return ("{\"error\":{\"message\":\"" + message + "\"}}").getBytes(StandardCharsets.UTF_8);
    }

    /** One query parameter out of a request path, decoded. */
    private static String query(String path, String name) {
        int q = path.indexOf('?');
        if (q < 0) return null;
        for (String pair : path.substring(q + 1).split("&")) {
            int e = pair.indexOf('=');
            String k = e < 0 ? pair : pair.substring(0, e);
            if (k.equals(name)) {
                try {
                    return URLDecoder.decode(e < 0 ? "" : pair.substring(e + 1), "UTF-8");
                } catch (Exception ex) {
                    return null;
                }
            }
        }
        return null;
    }

    private static String readLine(InputStream in) throws IOException {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        int c;
        while ((c = in.read()) != -1) {
            if (c == '\n') break;
            if (c != '\r') b.write(c);
        }
        if (c == -1 && b.size() == 0) return null;
        return b.toString("ISO-8859-1");
    }

    private static byte[] readExactly(InputStream in, int len) throws IOException {
        byte[] buf = new byte[len];
        int off = 0;
        while (off < len) {
            int n = in.read(buf, off, len - off);
            if (n < 0) break;
            off += n;
        }
        return buf;
    }

    private static byte[] readAll(InputStream in) throws IOException {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        copy(in, b);
        return b.toByteArray();
    }

    private static void copy(InputStream in, OutputStream out) throws IOException {
        byte[] buf = new byte[64 * 1024];
        int n;
        while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        out.flush();
    }

    /** Run on a desktop JVM for testing: java -cp out dev.toastconcern.metadb.Relay */
    public static void main(String[] args) throws InterruptedException {
        start();
        System.out.println("relay listening on http://127.0.0.1:" + PORT);
        Thread.currentThread().join();
    }
}
