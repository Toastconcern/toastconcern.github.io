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
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
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

    /** What the Oculus companion app on a Quest 3 sends when it pulls a binary. */
    static final String DOWNLOAD_UA =
            "Dalvik/2.1.0 (Linux; U; Android 14; Quest 3 Build/UP1A.231005.007.A1) "
                    + "[FBAN/OculusOCMS;FBAV/1048.0.0.0.870;FBCR/null;FBDV/Quest 3;FBHV/204;"
                    + "FBLC/en_US;FBSV/14;FBSBT/user;FBBD/oculus;FBBV/582512031;"
                    + "FBCA/arm64-v8a:armeabi-v7a:armeabi;FBMF/Oculus;FBPN/com.oculus.ocms;"
                    + "FBDW/null;FBVM/null;]";

    private static final Pattern ALLOWED =
            Pattern.compile("^https://(graph|www|securecdn(-[a-z0-9-]+)?)\\.oculus\\.com/.*");

    private static volatile boolean started;

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
            if (download) {
                up.setRequestProperty("User-Agent", DOWNLOAD_UA);
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
