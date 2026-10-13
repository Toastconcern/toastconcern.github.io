package dev.toastconcern.metadb;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageInstaller;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.util.Base64;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Builds on this headset: install, update or go back to one, keep a copy of it,
 * or copy the version that is installed now.
 *
 * Every build that is downloaded is kept as a backup — its APKs, its expansion
 * files and a meta.json — in this app's own storage, so installing it again
 * never downloads it again. Going back needs the app removed first (Android will
 * not replace a build with a lower one), which deletes its data, so the page is
 * asked first. Android's own install and uninstall screens still show; nothing
 * here can skip them.
 *
 * Everything is reported to the page as JSON events through `report`:
 *   progress  { id, text }
 *   ask       { id, askId, title, text, yes }     — answered with answer()
 *   done      { id, action, name, packageName, version, versionCode, prevVersion, prevCode, text }
 *   cancelled { id, text }
 *   error     { id, text }
 *   queued    { id, position, text }              — waiting its turn: one job runs at a time
 *   imported  (a done with action "imported")    — an APK of their own was added
 */
final class Installer {
    interface Report {
        void send(JSONObject event);
    }

    private static final String RESULT = "dev.toastconcern.metadb.INSTALL_RESULT";
    private static final Map<String, Object[]> asks = new ConcurrentHashMap<>();

    /* One job at a time, in the order they were asked for. A press while one
       runs waits its turn here rather than being turned away. */
    private final LinkedBlockingDeque<JSONObject> queue = new LinkedBlockingDeque<>();
    private volatile String running;
    private Thread worker;

    private final Activity act;
    private final Report report;

    Installer(Activity act, Report report) {
        this.act = act;
        this.report = report;
    }

    // ---------- jobs ----------

    /**
     * job: { type: install|save|restore|backup|import, id, apk, obb, binaryId, name,
     * version, backup, packageName, uri }. Queued; a "queued" event says where.
     */
    synchronized void start(JSONObject job) {
        String id = job.optString("id", "job");
        if (id.equals(running) || queued(id)) return;
        queue.add(job);
        if (running != null) {
            try {
                JSONObject o = new JSONObject();
                o.put("id", id);
                o.put("state", "queued");
                o.put("position", queue.size());
                o.put("text", "Queued");
                report.send(o);
            } catch (Exception ignored) {
            }
        }
        if (worker == null || !worker.isAlive()) {
            worker = new Thread(this::work, "installer");
            worker.start();
        }
    }

    /** Take a job out of the queue before it starts. True if it was waiting. */
    synchronized boolean dequeue(String id) {
        for (JSONObject j : queue) {
            if (id.equals(j.optString("id"))) {
                queue.remove(j);
                event(id, "cancelled", "Taken out of the queue.");
                renumber();
                return true;
            }
        }
        return false;
    }

    private boolean queued(String id) {
        for (JSONObject j : queue) if (id.equals(j.optString("id"))) return true;
        return false;
    }

    /** Tell every waiting job its new place in line. */
    private void renumber() {
        int n = 0;
        for (JSONObject j : queue) {
            n++;
            try {
                JSONObject o = new JSONObject();
                o.put("id", j.optString("id"));
                o.put("state", "queued");
                o.put("position", n);
                o.put("text", "Queued");
                report.send(o);
            } catch (Exception ignored) {
            }
        }
    }

    private void work() {
        while (true) {
            JSONObject job;
            synchronized (this) {
                job = queue.poll();
                if (job == null) {
                    running = null;
                    worker = null;
                    return;
                }
                running = job.optString("id", "job");
                renumber();
            }
            run(job);
        }
    }

    private void run(JSONObject job) {
        String id = job.optString("id", "job");
        try {
            switch (job.optString("type")) {
                case "install": {
                    File dir = fetchBuild(id, job);
                    installBackup(id, dir, "install");
                    break;
                }
                case "save": {
                    File dir = fetchBuild(id, job);
                    JSONObject m = meta(dir);
                    done(id, "saved", m, -1, null,
                            m.getString("name") + " " + m.getString("version") + " is saved on this headset.");
                    break;
                }
                case "restore":
                    installBackup(id, new File(root(), job.getString("backup")), "restore");
                    break;
                case "backup":
                    backupInstalled(id, job.getString("packageName"), job.optString("name", null));
                    break;
                case "import":
                    importApk(id, Uri.parse(job.getString("uri")), job.optString("fileName", null));
                    break;
                case "uninstall":
                    uninstall(id, job.getString("packageName"), job.optString("name", null));
                    break;
                case "selfupdate":
                    selfUpdate(id, job.getString("url"));
                    break;
                default:
                    throw new IOException("unknown job");
            }
        } catch (Cancelled c) {
            event(id, "cancelled", c.getMessage());
        } catch (Exception e) {
            event(id, "error", e.getMessage() == null ? e.toString() : e.getMessage());
        }
    }

    /** The page's answer to an "ask" event. */
    static void answer(String askId, boolean yes) {
        Object[] slot = asks.get(askId);
        if (slot == null) return;
        slot[1] = yes;
        ((CountDownLatch) slot[0]).countDown();
    }

    // ---------- backups ----------

    File root() {
        File r = act.getExternalFilesDir("backups");
        if (r == null) r = new File(act.getFilesDir(), "backups");
        r.mkdirs();
        return r;
    }

    /** Every kept build, newest first, as JSON. */
    String list() {
        JSONArray out = new JSONArray();
        File[] dirs = root().listFiles();
        if (dirs != null) {
            java.util.Arrays.sort(dirs, (a, b) -> Long.compare(b.lastModified(), a.lastModified()));
            for (File d : dirs) {
                try {
                    JSONObject m = meta(d);
                    if (m != null) out.put(m);
                } catch (Exception ignored) {
                }
            }
        }
        return out.toString();
    }

    boolean delete(String backupId) {
        if (backupId == null || backupId.contains("/") || backupId.contains("..")) return false;
        return deleteTree(new File(root(), backupId));
    }

    /** A kept build already holding this binary, so it is not downloaded twice. */
    private File findByBinary(String binaryId) {
        if (binaryId == null) return null;
        File[] dirs = root().listFiles();
        if (dirs == null) return null;
        for (File d : dirs) {
            try {
                JSONObject m = meta(d);
                if (m != null && binaryId.equals(m.optString("binaryId", null))) return d;
            } catch (Exception ignored) {
            }
        }
        return null;
    }

    private static JSONObject meta(File dir) throws Exception {
        File f = new File(dir, "meta.json");
        if (!f.isFile()) return null;
        return new JSONObject(new String(readAll(new FileInputStream(f)), StandardCharsets.UTF_8));
    }

    private static void writeMeta(File dir, JSONObject m) throws IOException {
        try (OutputStream o = new FileOutputStream(new File(dir, "meta.json"))) {
            o.write(m.toString().getBytes(StandardCharsets.UTF_8));
        }
    }

    /** Download a build into a kept backup, or find the one already kept. */
    private File fetchBuild(String id, JSONObject job) throws Exception {
        String binaryId = job.optString("binaryId", null);
        File kept = findByBinary(binaryId);
        if (kept != null) {
            progress(id, "Using the saved copy…");
            return kept;
        }

        File part = new File(root(), ".part-" + id.replaceAll("[^A-Za-z0-9_-]", ""));
        deleteTree(part);
        part.mkdirs();
        File apk = new File(part, "base.apk");
        fetch(job.getString("apk"), apk, pct -> progress(id, "Downloading " + pct + "%"));

        PackageInfo info = act.getPackageManager().getPackageArchiveInfo(apk.getPath(), 0);
        if (info == null) throw new IOException("the download is not an APK");
        /* A build meant for one app — a GitHub release linked to it — must be that
           app; anything else is refused before it is kept or installed. */
        String expect = job.optString("packageName", "");
        if (!expect.isEmpty() && !expect.equals(info.packageName)) {
            deleteTree(part);
            throw new IOException("that APK is " + info.packageName + ", not " + expect + ", so it was not installed");
        }
        if (info.applicationInfo != null) {
            info.applicationInfo.sourceDir = apk.getPath();
            info.applicationInfo.publicSourceDir = apk.getPath();
            saveIcon(act.getPackageManager().getApplicationIcon(info.applicationInfo), new File(part, "icon.png"));
        }

        JSONArray obbs = new JSONArray();
        if (!job.isNull("obb") && job.has("obb")) {
            File od = new File(part, "obb");
            od.mkdirs();
            File tmp = new File(od, ".download");
            String sent = fetch(job.getString("obb"), tmp, pct -> progress(id, "Expansion file " + pct + "%"));
            String name = sent != null ? sent : "main." + info.getLongVersionCode() + "." + info.packageName + ".obb";
            if (!tmp.renameTo(new File(od, name))) throw new IOException("the expansion file could not be saved");
            obbs.put(name);
        }

        JSONObject m = new JSONObject();
        String dirName = info.packageName + "-" + info.getLongVersionCode() + "-" + System.currentTimeMillis();
        m.put("id", dirName);
        m.put("packageName", info.packageName);
        m.put("name", job.optString("name", info.packageName));
        m.put("version", job.optString("version", String.valueOf(info.versionName)));
        m.put("versionCode", info.getLongVersionCode());
        m.put("binaryId", binaryId == null ? JSONObject.NULL : binaryId);
        m.put("appId", job.optString("appId", ""));
        m.put("source", job.optString("source", "download"));
        if (job.has("repo")) m.put("repo", job.optString("repo"));
        m.put("savedAt", System.currentTimeMillis());
        m.put("apks", new JSONArray().put("base.apk"));
        m.put("obbs", obbs);
        m.put("icon", "icon.png");
        m.put("size", treeSize(part));
        writeMeta(part, m);

        File dir = new File(root(), dirName);
        if (!part.renameTo(dir)) throw new IOException("the download could not be kept");
        return dir;
    }

    /** Copy the version installed now — its APKs and expansion files — into a kept backup. */
    private void backupInstalled(String id, String pkg, String name) throws Exception {
        PackageManager pm = act.getPackageManager();
        PackageInfo info;
        try {
            info = pm.getPackageInfo(pkg, 0);
        } catch (PackageManager.NameNotFoundException e) {
            throw new IOException(pkg + " is not installed");
        }
        ApplicationInfo ai = info.applicationInfo;
        // Without all-files access another app's Android/obb looks empty, and a
        // backup missing its expansion file would not bring the game back — so
        // this is asked for before looking, not after finding nothing.
        needFiles(id, "Allow MetaDB to copy the app's files…");
        File[] obbFiles = new File(Environment.getExternalStorageDirectory(), "Android/obb/" + pkg).listFiles();

        String dirName = pkg + "-" + info.getLongVersionCode() + "-" + System.currentTimeMillis();
        File part = new File(root(), ".part-" + dirName);
        deleteTree(part);
        part.mkdirs();

        JSONArray apks = new JSONArray();
        saveIcon(pm.getApplicationIcon(ai), new File(part, "icon.png"));
        copyFile(new File(ai.sourceDir), new File(part, "base.apk"), pct -> progress(id, "Copying the app " + pct + "%"));
        apks.put("base.apk");
        if (ai.splitSourceDirs != null) {
            int i = 0;
            for (String split : ai.splitSourceDirs) {
                String n = "split" + (i++) + ".apk";
                copyFile(new File(split), new File(part, n), null);
                apks.put(n);
            }
        }

        JSONArray obbs = new JSONArray();
        if (obbFiles != null && obbFiles.length > 0) {
            File od = new File(part, "obb");
            od.mkdirs();
            for (File f : obbFiles) {
                if (!f.isFile()) continue;
                copyFile(f, new File(od, f.getName()), pct -> progress(id, "Copying the expansion file " + pct + "%"));
                obbs.put(f.getName());
            }
        }

        JSONObject m = new JSONObject();
        m.put("id", dirName);
        m.put("packageName", pkg);
        m.put("name", name != null && !name.isEmpty() ? name : String.valueOf(pm.getApplicationLabel(ai)));
        m.put("version", info.versionName == null ? "" : info.versionName);
        m.put("versionCode", info.getLongVersionCode());
        m.put("binaryId", JSONObject.NULL);
        m.put("source", "headset");
        m.put("icon", "icon.png");
        m.put("savedAt", System.currentTimeMillis());
        m.put("apks", apks);
        m.put("obbs", obbs);
        m.put("size", treeSize(part));
        writeMeta(part, m);
        File dir = new File(root(), dirName);
        if (!part.renameTo(dir)) throw new IOException("the copy could not be kept");

        done(id, "backed-up", m, -1, null,
                m.getString("name") + " " + m.getString("version") + " is backed up on this headset.");
    }

    /**
     * Copy an APK the person picked into a kept backup of its own. Everything
     * about it — package, name, version, build, icon — is read out of the APK.
     */
    private void importApk(String id, Uri uri, String fileName) throws Exception {
        progress(id, "Adding " + (fileName != null ? fileName : "the APK") + "…");
        File part = new File(root(), ".part-" + id.replaceAll("[^A-Za-z0-9_-]", ""));
        deleteTree(part);
        part.mkdirs();
        File apk = new File(part, "base.apk");
        try (InputStream in = act.getContentResolver().openInputStream(uri);
             OutputStream out = new FileOutputStream(apk)) {
            if (in == null) throw new IOException("that file could not be opened");
            copy(in, out, -1, null);
        }

        PackageManager pm = act.getPackageManager();
        PackageInfo info = pm.getPackageArchiveInfo(apk.getPath(), 0);
        if (info == null) {
            deleteTree(part);
            throw new IOException((fileName != null ? fileName : "That file") + " is not an APK Android can read");
        }
        ApplicationInfo ai = info.applicationInfo;
        ai.sourceDir = apk.getPath();
        ai.publicSourceDir = apk.getPath();
        String label = String.valueOf(pm.getApplicationLabel(ai));
        saveIcon(pm.getApplicationIcon(ai), new File(part, "icon.png"));

        String dirName = info.packageName + "-" + info.getLongVersionCode() + "-" + System.currentTimeMillis();
        JSONObject m = new JSONObject();
        m.put("id", dirName);
        m.put("packageName", info.packageName);
        m.put("name", label.isEmpty() ? info.packageName : label);
        m.put("version", info.versionName == null ? "" : info.versionName);
        m.put("versionCode", info.getLongVersionCode());
        m.put("binaryId", JSONObject.NULL);
        m.put("source", "file");
        m.put("fileName", fileName == null ? JSONObject.NULL : fileName);
        m.put("savedAt", System.currentTimeMillis());
        m.put("apks", new JSONArray().put("base.apk"));
        m.put("obbs", new JSONArray());
        m.put("icon", "icon.png");
        m.put("size", treeSize(part));
        writeMeta(part, m);
        File dir = new File(root(), dirName);
        if (!part.renameTo(dir)) throw new IOException("the APK could not be kept");

        done(id, "imported", m, -1, null, m.getString("name") + " " + m.getString("version") + " was added to your backups.");
    }

    /** An app icon as a small PNG beside a backup, so the page can show it with no store entry. */
    private static void saveIcon(Drawable d, File to) {
        if (d == null) return;
        try {
            int size = 96;
            Bitmap b = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
            Canvas c = new Canvas(b);
            d.setBounds(0, 0, size, size);
            d.draw(c);
            try (OutputStream o = new FileOutputStream(to)) {
                b.compress(Bitmap.CompressFormat.PNG, 100, o);
            }
        } catch (Exception ignored) {
        }
    }

    /** The icon kept with a backup, as a data: URL, or null. */
    String backupIcon(String backupId) {
        if (backupId == null || backupId.contains("/") || backupId.contains("..")) return null;
        File f = new File(new File(root(), backupId), "icon.png");
        if (!f.isFile()) return null;
        try {
            return "data:image/png;base64," + Base64.encodeToString(readAll(new FileInputStream(f)), Base64.NO_WRAP);
        } catch (Exception e) {
            return null;
        }
    }

    /** An installed app's icon, as a data: URL, or null. */
    String appIcon(String pkg) {
        try {
            File tmp = File.createTempFile("icon", ".png", act.getCacheDir());
            saveIcon(act.getPackageManager().getApplicationIcon(pkg), tmp);
            String out = "data:image/png;base64," + Base64.encodeToString(readAll(new FileInputStream(tmp)), Base64.NO_WRAP);
            tmp.delete();
            return out;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Update MetaDB itself from the APK the site publishes. It has to be this
     * app, signed the same, and newer — anything else is refused before Android
     * is asked. Android closes the app to replace it; it opens again from the
     * library.
     */
    private void selfUpdate(String id, String url) throws Exception {
        PackageManager pm = act.getPackageManager();
        String self = act.getPackageName();
        long have = installedCode(self);
        File apk = new File(act.getCacheDir(), "metadb-update.apk");
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(30_000);
        c.setReadTimeout(120_000);
        if (c.getResponseCode() != 200) throw new IOException("the update returned " + c.getResponseCode());
        try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(apk)) {
            copy(in, out, c.getContentLengthLong(), pct -> progress(id, "Downloading " + pct + "%"));
        }
        PackageInfo info = pm.getPackageArchiveInfo(apk.getPath(), 0);
        if (info == null) throw new IOException("the update is not an APK — is it published yet?");
        if (!self.equals(info.packageName)) throw new IOException("the update is not MetaDB");
        if (info.getLongVersionCode() <= have) throw new Cancelled("MetaDB is already up to date.");
        progress(id, "Installing…");
        install(new File[] {apk}, self);
        apk.delete();
    }

    /**
     * Remove an app. The page has already asked, in its own words; Android
     * asks again with its own screen, and that answer is the one that counts.
     */
    private void uninstall(String id, String pkg, String name) throws Exception {
        long have = installedCode(pkg);
        if (have < 0) throw new IOException((name != null ? name : pkg) + " is not installed");
        String haveName = installedName(pkg);
        progress(id, "Uninstalling…");
        act.startActivity(new Intent(Intent.ACTION_DELETE, Uri.parse("package:" + pkg))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
        if (!waitFor(() -> installedCode(pkg) < 0, 180)) {
            throw new Cancelled("The uninstall was cancelled, so nothing was changed.");
        }
        JSONObject m = new JSONObject();
        m.put("name", name != null && !name.isEmpty() ? name : pkg);
        m.put("packageName", pkg);
        m.put("version", haveName == null ? "" : haveName);
        m.put("versionCode", have);
        done(id, "uninstalled", m, have, haveName, m.getString("name") + " was uninstalled.");
    }

    /** Install a kept build: ask before going back, then Android's installer, then the expansion files. */
    private void installBackup(String id, File dir, String how) throws Exception {
        JSONObject m = meta(dir);
        if (m == null) throw new IOException("that backup is missing its files");
        String pkg = m.getString("packageName");
        String name = m.getString("name");
        String version = m.getString("version");
        long code = m.getLong("versionCode");
        long have = installedCode(pkg);
        String haveName = installedName(pkg);

        if (have == code) {
            done(id, "same", m, have, haveName, name + " is already on " + version + ".");
            return;
        }

        if (have > code) {
            boolean sure = ask(id, "Go back to " + version + "?",
                    name + " will be uninstalled first, which deletes its saved data on this headset. "
                            + "This cannot be undone. A backup of the version you are on now is kept only "
                            + "if you made one.",
                    "Uninstall and go back");
            if (!sure) throw new Cancelled("Nothing was changed.");
            progress(id, "Uninstalling…");
            act.startActivity(new Intent(Intent.ACTION_DELETE, Uri.parse("package:" + pkg))
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            if (!waitFor(() -> installedCode(pkg) < 0, 180)) {
                throw new Cancelled("The uninstall was cancelled, so nothing was changed.");
            }
        }

        PackageManager pm = act.getPackageManager();
        if (!pm.canRequestPackageInstalls()) {
            progress(id, "Allow MetaDB to install apps…");
            act.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + act.getPackageName())).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            if (!waitFor(pm::canRequestPackageInstalls, 180)) {
                throw new IOException("MetaDB was not allowed to install apps");
            }
        }

        progress(id, "Installing…");
        JSONArray apks = m.getJSONArray("apks");
        File[] files = new File[apks.length()];
        for (int i = 0; i < apks.length(); i++) files[i] = new File(dir, apks.getString(i));
        install(files, pkg);

        JSONArray obbs = m.optJSONArray("obbs");
        if (obbs != null && obbs.length() > 0) {
            if (!canManageFiles()) needFiles(id, "Allow MetaDB to put the expansion file in place…");
            File target = new File(Environment.getExternalStorageDirectory(), "Android/obb/" + pkg);
            target.mkdirs();
            for (int i = 0; i < obbs.length(); i++) {
                String n = obbs.getString(i);
                File out = new File(target, n);
                File tmp = new File(target, ".metadb-copy");
                copyFile(new File(new File(dir, "obb"), n), tmp, pct -> progress(id, "Expansion file " + pct + "%"));
                out.delete();
                if (!tmp.renameTo(out)) throw new IOException("installed, but the expansion file could not be put in place");
            }
        }

        String action = have < 0 ? "installed" : have > code ? "downgraded" : "updated";
        if ("restore".equals(how) && have < 0) action = "restored";
        done(id, action, m, have, haveName, name + " is now on " + version
                + (obbs != null && obbs.length() > 0 ? ", expansion file and all." : "."));
    }

    // ---------- Android ----------

    long installedCode(String pkg) {
        try {
            return act.getPackageManager().getPackageInfo(pkg, 0).getLongVersionCode();
        } catch (PackageManager.NameNotFoundException e) {
            return -1;
        }
    }

    private String installedName(String pkg) {
        try {
            return act.getPackageManager().getPackageInfo(pkg, 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            return null;
        }
    }

    /**
     * Whether MetaDB may write in Android/obb. Android 11 and later call that
     * all-files access; Android 10 has no such thing, and uses the older storage
     * permission instead (with legacy storage, set in the manifest).
     */
    private boolean canManageFiles() {
        if (Build.VERSION.SDK_INT >= 30) return Environment.isExternalStorageManager();
        return act.checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                == PackageManager.PERMISSION_GRANTED;
    }

    /** All-files access, for Android/obb. Asked for only when a build has an expansion file. */
    private void needFiles(String id, String text) throws Exception {
        if (canManageFiles()) return;
        progress(id, text);
        if (Build.VERSION.SDK_INT >= 30) {
            act.startActivity(new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION,
                    Uri.parse("package:" + act.getPackageName())).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
        } else {
            act.runOnUiThread(() -> act.requestPermissions(new String[] {
                    android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    android.Manifest.permission.READ_EXTERNAL_STORAGE}, 7));
        }
        if (!waitFor(this::canManageFiles, 180)) {
            throw new IOException("MetaDB was not allowed to manage files, which the expansion file needs");
        }
    }

    /** Hand the APKs to Android's installer and wait for its answer. */
    private void install(File[] apks, String pkg) throws Exception {
        PackageInstaller pi = act.getPackageManager().getPackageInstaller();
        PackageInstaller.SessionParams params =
                new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
        params.setAppPackageName(pkg);
        int sid = pi.createSession(params);

        try (PackageInstaller.Session s = pi.openSession(sid)) {
            for (File apk : apks) {
                try (InputStream in = new FileInputStream(apk);
                     OutputStream out = s.openWrite(apk.getName(), 0, apk.length())) {
                    copy(in, out, apk.length(), null);
                    s.fsync(out);
                }
            }
        }

        final CountDownLatch finished = new CountDownLatch(1);
        final String[] failure = {null};
        BroadcastReceiver r = new BroadcastReceiver() {
            @Override
            public void onReceive(Context c, Intent intent) {
                int status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE);
                if (status == PackageInstaller.STATUS_PENDING_USER_ACTION) {
                    Intent confirm = intent.getParcelableExtra(Intent.EXTRA_INTENT);
                    if (confirm != null) act.startActivity(confirm.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
                    return;
                }
                if (status != PackageInstaller.STATUS_SUCCESS) {
                    String msg = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE);
                    failure[0] = status == PackageInstaller.STATUS_FAILURE_ABORTED
                            ? "cancelled"
                            : "Android refused the install" + (msg != null ? ": " + msg : "");
                }
                finished.countDown();
            }
        };
        IntentFilter f = new IntentFilter(RESULT);
        if (Build.VERSION.SDK_INT >= 33) act.registerReceiver(r, f, 4); // RECEIVER_NOT_EXPORTED
        else act.registerReceiver(r, f);
        try {
            Intent back = new Intent(RESULT).setPackage(act.getPackageName());
            PendingIntent pending = PendingIntent.getBroadcast(act, sid, back,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
            try (PackageInstaller.Session s = pi.openSession(sid)) {
                s.commit(pending.getIntentSender());
            }
            if (!finished.await(10, TimeUnit.MINUTES)) throw new IOException("the install did not finish");
            if ("cancelled".equals(failure[0])) throw new Cancelled("The install was cancelled. The build is still saved.");
            if (failure[0] != null) throw new IOException(failure[0]);
        } finally {
            act.unregisterReceiver(r);
        }
    }

    // ---------- the page ----------

    /** A question for the page's own dialog, answered with answer(). */
    private boolean ask(String id, String title, String text, String yes) throws Exception {
        String askId = id + ":" + System.nanoTime();
        CountDownLatch latch = new CountDownLatch(1);
        Object[] slot = {latch, Boolean.FALSE};
        asks.put(askId, slot);
        try {
            JSONObject o = new JSONObject();
            o.put("id", id);
            o.put("state", "ask");
            o.put("askId", askId);
            o.put("title", title);
            o.put("text", text);
            o.put("yes", yes);
            report.send(o);
            if (!latch.await(15, TimeUnit.MINUTES)) return false;
            return (Boolean) slot[1];
        } finally {
            asks.remove(askId);
        }
    }

    private void progress(String id, String text) {
        event(id, "progress", text);
    }

    private void event(String id, String state, String text) {
        try {
            JSONObject o = new JSONObject();
            o.put("id", id);
            o.put("state", state);
            o.put("text", text);
            report.send(o);
        } catch (Exception ignored) {
        }
    }

    private void done(String id, String action, JSONObject m, long prevCode, String prevVersion, String text) {
        try {
            JSONObject o = new JSONObject();
            o.put("id", id);
            o.put("state", "done");
            o.put("action", action);
            o.put("text", text);
            o.put("name", m.optString("name"));
            o.put("packageName", m.optString("packageName"));
            o.put("version", m.optString("version"));
            o.put("versionCode", m.optLong("versionCode"));
            o.put("backup", m.optString("id"));
            if (prevCode >= 0) o.put("prevCode", prevCode);
            if (prevVersion != null) o.put("prevVersion", prevVersion);
            report.send(o);
        } catch (Exception ignored) {
        }
    }

    // ---------- files ----------

    /**
     * Download a file. Meta's CDN gets the app manager's headers, as the relay sends
     * them; anywhere else (a GitHub release) is asked plainly. Returns the server's
     * file name, if it gave one.
     */
    private static String fetch(String url, File to, Progress p) throws IOException {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        String host = c.getURL().getHost();
        if (host.endsWith(".oculus.com")) Relay.applyHeaders(c);
        else c.setRequestProperty("User-Agent", "MetaDB-Quest");
        c.setRequestProperty("Accept", "*/*");
        c.setRequestProperty("Accept-Encoding", "identity");
        c.setConnectTimeout(30_000);
        c.setReadTimeout(120_000);
        int status = c.getResponseCode();
        if (status != 200) {
            String why = c.getHeaderField("X-Binary-Download-Denial-Reason");
            throw new IOException("the download returned " + status + (why != null ? " (" + why + ")" : ""));
        }
        String name = null;
        String cd = c.getHeaderField("Content-Disposition");
        if (cd != null) {
            Matcher m = Pattern.compile("filename=\"?([^\";]+)\"?").matcher(cd);
            if (m.find()) name = new File(m.group(1)).getName();
        }
        try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(to)) {
            copy(in, out, c.getContentLengthLong(), p);
        }
        return name;
    }

    private static void copyFile(File from, File to, Progress p) throws IOException {
        try (InputStream in = new FileInputStream(from); OutputStream out = new FileOutputStream(to)) {
            copy(in, out, from.length(), p);
        }
    }

    interface Progress {
        void at(int percent);
    }

    private static void copy(InputStream in, OutputStream out, long total, Progress p) throws IOException {
        byte[] buf = new byte[256 * 1024];
        long done = 0;
        int last = -1;
        int n;
        while ((n = in.read(buf)) > 0) {
            out.write(buf, 0, n);
            done += n;
            if (p != null && total > 0) {
                int pct = (int) (done * 100 / total);
                if (pct != last) {
                    last = pct;
                    p.at(pct);
                }
            }
        }
        out.flush();
    }

    private static byte[] readAll(InputStream in) throws IOException {
        try (InputStream i = in) {
            java.io.ByteArrayOutputStream b = new java.io.ByteArrayOutputStream();
            copy(i, b, -1, null);
            return b.toByteArray();
        }
    }

    private static long treeSize(File f) {
        if (f.isFile()) return f.length();
        long n = 0;
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) n += treeSize(k);
        return n;
    }

    private static boolean deleteTree(File f) {
        if (!f.exists()) return false;
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) deleteTree(k);
        return f.delete();
    }

    interface Check {
        boolean ok();
    }

    /** Poll until `check` holds, for up to `seconds`. Used while Android shows its own screen. */
    private static boolean waitFor(Check check, int seconds) throws InterruptedException {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (System.currentTimeMillis() < end) {
            if (check.ok()) return true;
            Thread.sleep(500);
        }
        return check.ok();
    }

    /** Stopped on purpose — by the person, not by a fault. */
    private static final class Cancelled extends Exception {
        Cancelled(String message) {
            super(message);
        }
    }
}
