package dev.toastconcern.metadb;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * MetaDB on the headset: the site in a full-screen web view.
 *
 * Three things the browser cannot do are done here instead:
 *   - the relay runs inside the app (see Relay), and the site is pointed at it;
 *   - "Sign in with Meta" in Settings opens Meta's own login in this view, then
 *     reads the two tokens out of this view's cookies and puts them in Settings;
 *   - downloads go to the headset's Downloads folder, and an APK opens the
 *     installer when it finishes.
 *
 * Nothing is sent anywhere but Meta and the site itself. The tokens stay in this
 * app's storage on the headset, the same place the browser would keep them.
 */
public final class MainActivity extends Activity {
    static final String SITE = "https://metadb.toastconcern.dev/";
    static final String RELAY = "http://127.0.0.1:" + Relay.PORT + "/?url={url}";
    /** Where sign-in starts; secure.oculus.com sends a signed-out visitor to Meta's login. */
    static final String SIGN_IN = "https://secure.oculus.com/my/profile/";
    static final int PICK_APKS = 7;

    private WebView web;
    private Installer installer;
    /** The site this window shows. A debug build may be pointed elsewhere with --es site <url>. */
    private Uri site = Uri.parse(SITE);
    private boolean signingIn;
    /** The screen to come back to once sign-in has the tokens: "settings" or "downgrade". */
    private String signInReturn = "downgrade";
    private String foundToken;
    private String foundAcToken;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        Relay.start();

        // Only a DEBUG=1 build is debuggable; that lets Chrome's DevTools attach to the page.
        try {
            ApplicationInfo ai = getPackageManager().getApplicationInfo(getPackageName(), PackageManager.GET_META_DATA);
            String built = ai.metaData == null ? null : ai.metaData.getString("metadb.site");
            if (built != null && !built.isEmpty()) site = Uri.parse(built);
        } catch (PackageManager.NameNotFoundException ignored) {
        }
        if ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            WebView.setWebContentsDebuggingEnabled(true);
            String other = getIntent().getStringExtra("site");
            if (other != null) site = Uri.parse(other);
        }

        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        // Present as the Quest Browser: the "; wv" marker tells Meta's login it is
        // inside an app, and it is fussier there (QuestAppVersionSwitcher does the same).
        s.setUserAgentString(s.getUserAgentString().replace("; wv)", ")"));

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(web, true);

        installer = new Installer(this, event -> sendToPage(event.toString()));
        web.addJavascriptInterface(new Bridge(), "MetaDBApp");
        web.setWebChromeClient(new WebChromeClient()); // alert/confirm dialogs
        web.setWebViewClient(new Client());
        web.setDownloadListener(this::download);

        int flags = 2; // Context.RECEIVER_EXPORTED: the download service is another app
        if (Build.VERSION.SDK_INT >= 33) {
            registerReceiver(downloaded, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE), flags);
        } else {
            registerReceiver(downloaded, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
        }

        if (saved != null) web.restoreState(saved);
        else web.loadUrl(site.toString());
    }

    /** An installer event, to the page. */
    private void sendToPage(String json) {
        runOnUiThread(() -> web.evaluateJavascript("window.metadbInstall&&window.metadbInstall(" + json + ")", null));
    }

    /** The APKs picked for + Add APK: each is queued as its own import. */
    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != PICK_APKS || result != RESULT_OK || data == null) return;
        java.util.List<Uri> picked = new java.util.ArrayList<>();
        if (data.getClipData() != null) {
            for (int i = 0; i < data.getClipData().getItemCount(); i++) picked.add(data.getClipData().getItemAt(i).getUri());
        } else if (data.getData() != null) {
            picked.add(data.getData());
        }
        long now = System.currentTimeMillis();
        for (int i = 0; i < picked.size(); i++) {
            Uri u = picked.get(i);
            try {
                JSONObject j = new JSONObject();
                j.put("type", "import");
                j.put("id", "import:" + now + "-" + i);
                j.put("uri", u.toString());
                j.put("fileName", displayName(u));
                installer.start(j);
            } catch (Exception ignored) {
            }
        }
    }

    /** A picked file's name, as the picker shows it. */
    private String displayName(Uri u) {
        try (android.database.Cursor c = getContentResolver().query(u,
                new String[] {android.provider.OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (c != null && c.moveToFirst()) return c.getString(0);
        } catch (Exception ignored) {
        }
        return null;
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    protected void onDestroy() {
        unregisterReceiver(downloaded);
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    /** What the page can call. Only the site's own pages ever see it used. */
    private final class Bridge {
        /** Settings → Sign in with Meta: open Meta's login; the tokens are read when it finishes. */
        @JavascriptInterface
        public void signIn(String back) {
            runOnUiThread(() -> {
                signingIn = true;
                signInReturn = back == null || back.isEmpty() ? "downgrade" : back;
                web.loadUrl(SIGN_IN);
            });
        }

        /** Settings → Reset: forget the Meta login in this app too. */
        @JavascriptInterface
        public void signOut() {
            CookieManager cm = CookieManager.getInstance();
            cm.removeAllCookies(null);
            cm.flush();
        }

        /** The relay this app runs, so Reset can put it back. */
        @JavascriptInterface
        public String relay() {
            return RELAY;
        }

        /**
         * Install, upgrade or go back to a build. `job` is JSON:
         * { id, apk, obb (or null), name, version } — apk and obb are the
         * site's download links. Progress comes back through window.metadbInstall.
         */
        @JavascriptInterface
        public void install(String job) {
            run(job, "install");
        }

        /** Download a build and keep it, without installing it. Same job shape as install(). */
        @JavascriptInterface
        public void save(String job) {
            run(job, "save");
        }

        /** Install a kept build by its backup id. */
        @JavascriptInterface
        public void restore(String jobId, String backup) {
            run("{\"id\":" + JSONObject.quote(jobId) + ",\"backup\":" + JSONObject.quote(backup) + "}", "restore");
        }

        /** Keep a copy of the version of an app installed now. */
        @JavascriptInterface
        public void backup(String jobId, String pkg, String name) {
            run("{\"id\":" + JSONObject.quote(jobId) + ",\"packageName\":" + JSONObject.quote(pkg)
                    + ",\"name\":" + JSONObject.quote(name == null ? "" : name) + "}", "backup");
        }

        /** Every kept build, newest first: [{ id, packageName, name, version, versionCode, binaryId, source, savedAt, size, apks, obbs }]. */
        @JavascriptInterface
        public String backups() {
            return installer.list();
        }

        @JavascriptInterface
        public boolean deleteBackup(String id) {
            return installer.delete(id);
        }

        /** Backups → + Add APK: the headset's file picker; each APK picked becomes its own backup. */
        @JavascriptInterface
        public void addApks() {
            runOnUiThread(() -> {
                Intent pick = new Intent(Intent.ACTION_OPEN_DOCUMENT)
                        .addCategory(Intent.CATEGORY_OPENABLE)
                        .setType("*/*")
                        .putExtra(Intent.EXTRA_MIME_TYPES, new String[] {
                                "application/vnd.android.package-archive", "application/octet-stream"})
                        .putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try {
                    startActivityForResult(pick, PICK_APKS);
                } catch (Exception e) {
                    sendToPage("{\"id\":\"import\",\"state\":\"error\",\"text\":\"This headset has no file picker to choose an APK with.\"}");
                }
            });
        }

        /** This app's own version: { versionCode, versionName }. */
        @JavascriptInterface
        public String appVersion() {
            try {
                android.content.pm.PackageInfo p = getPackageManager().getPackageInfo(getPackageName(), 0);
                return new JSONObject().put("versionCode", p.getLongVersionCode())
                        .put("versionName", p.versionName == null ? "" : p.versionName).toString();
            } catch (Exception e) {
                return "{}";
            }
        }

        /** Update MetaDB itself from the APK at `url` (the site's downloads/MetaDB.apk). */
        @JavascriptInterface
        public void updateApp(String jobId, String url) {
            run("{\"id\":" + JSONObject.quote(jobId) + ",\"url\":" + JSONObject.quote(url) + "}", "selfupdate");
        }

        /** Uninstall an app, after the page has asked. Queued like the rest. */
        @JavascriptInterface
        public void uninstall(String jobId, String pkg, String name) {
            run("{\"id\":" + JSONObject.quote(jobId) + ",\"packageName\":" + JSONObject.quote(pkg)
                    + ",\"name\":" + JSONObject.quote(name == null ? "" : name) + "}", "uninstall");
        }

        /** Take a job out of the queue before it starts. */
        @JavascriptInterface
        public boolean dequeue(String id) {
            return installer.dequeue(id);
        }

        /** The icon kept with a backup, as a data: URL, or null. */
        @JavascriptInterface
        public String backupIcon(String backupId) {
            return installer.backupIcon(backupId);
        }

        /** An installed app's icon, as a data: URL, or null. */
        @JavascriptInterface
        public String appIcon(String pkg) {
            return installer.appIcon(pkg);
        }

        /** The page's answer to a question the installer asked. */
        @JavascriptInterface
        public void answer(String askId, boolean yes) {
            Installer.answer(askId, yes);
        }

        private void run(String job, String type) {
            try {
                JSONObject j = new JSONObject(job);
                j.put("type", type);
                if (j.has("apk")) j.put("apk", target(j.getString("apk")));
                if (j.has("obb") && !j.isNull("obb")) j.put("obb", target(j.getString("obb")));
                installer.start(j);
            } catch (Exception e) {
                toast("Could not start: " + e.getMessage());
            }
        }

        /**
         * Every app installed on this headset that is not part of the system, as
         * JSON: [{ packageName, label, version, versionCode, installer }]. The
         * page sorts them into store apps and unknown sources.
         */
        @JavascriptInterface
        public String installedApps() {
            PackageManager pm = getPackageManager();
            JSONArray out = new JSONArray();
            for (PackageInfo p : pm.getInstalledPackages(0)) {
                ApplicationInfo ai = p.applicationInfo;
                if (ai == null || (ai.flags & ApplicationInfo.FLAG_SYSTEM) != 0) continue;
                if (p.packageName.equals(getPackageName())) continue;
                try {
                    JSONObject o = new JSONObject();
                    o.put("packageName", p.packageName);
                    o.put("label", String.valueOf(pm.getApplicationLabel(ai)));
                    o.put("version", p.versionName == null ? JSONObject.NULL : p.versionName);
                    o.put("versionCode", p.getLongVersionCode());
                    String by = null;
                    try {
                        by = pm.getInstallSourceInfo(p.packageName).getInstallingPackageName();
                    } catch (Exception ignored) {
                    }
                    o.put("installer", by == null ? JSONObject.NULL : by);
                    out.put(o);
                } catch (Exception ignored) {
                }
            }
            return out.toString();
        }

        /** The version code installed for a package, or -1. */
        @JavascriptInterface
        public long installedVersion(String pkg) {
            return installer.installedCode(pkg);
        }
    }

    private final class Client extends WebViewClient {
        /** The site, Meta's sign-in and the store stay in the app; anything else opens in the browser. */
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            // Meta's login hops between its own sites (meta.com, facebook.com,
            // instagram.com, accounts centre); while it runs, every https page stays here.
            if (signingIn && "https".equals(u.getScheme())) return false;
            if (inApp(u)) return false;
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, u));
            } catch (Exception e) {
                toast("No app can open " + u.getHost());
            }
            return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            Uri u = Uri.parse(url);
            if (signingIn && !onSite(u)) {
                readTokens();
                if (foundToken != null) {
                    signingIn = false;
                    web.loadUrl(site.buildUpon().fragment(signInReturn).build().toString());
                }
                return;
            }
            if (onSite(u)) {
                // Back on the site without finishing sign-in counts as giving up on it.
                signingIn = false;
                setUpSite();
            }
        }
    }

    /** Pull oc_www_at and oc_ac_at out of the cookies Meta's login just set. */
    private void readTokens() {
        CookieManager cm = CookieManager.getInstance();
        cm.flush();
        for (String base : new String[] {"https://secure.oculus.com", "https://www.oculus.com", "https://www.meta.com"}) {
            String all = cm.getCookie(base);
            if (all == null) continue;
            for (String pair : all.split(";")) {
                String p = pair.trim();
                if (p.startsWith("oc_www_at=")) foundToken = p.substring("oc_www_at=".length());
                if (p.startsWith("oc_ac_at=")) foundAcToken = p.substring("oc_ac_at=".length());
            }
        }
    }

    /**
     * Point the site at the built-in relay, and hand it any tokens sign-in found.
     * Written straight into the site's own settings, then the page reloads so it
     * reads them — the same as pasting them into Settings and pressing Save.
     */
    private void setUpSite() {
        StringBuilder js = new StringBuilder("(function(){var s=localStorage,c=false;");
        js.append("if(!s.getItem('metadb.relay')){s.setItem('metadb.relay',")
                .append(JSONObject.quote(RELAY)).append(");c=true;}");
        if (foundToken != null) {
            // Said by the page once it reloads, in its own notification.
            js.append("sessionStorage.setItem('metadb.notice','Signed in. Your tokens are saved on this headset.');");
            js.append("s.setItem('metadb.token',").append(JSONObject.quote(foundToken)).append(");c=true;");
        }
        if (foundAcToken != null) {
            js.append("s.setItem('metadb.acToken',").append(JSONObject.quote(foundAcToken)).append(");c=true;");
        }
        js.append("if(c)location.reload();})();");
        foundToken = null;
        foundAcToken = null;
        web.evaluateJavascript(js.toString(), null);
    }

    private boolean onSite(Uri u) {
        return site.getScheme().equals(u.getScheme())
                && site.getHost().equals(u.getHost())
                && site.getPort() == u.getPort();
    }

    private boolean inApp(Uri u) {
        String host = u.getHost() == null ? "" : u.getHost();
        return onSite(u)
                || host.equals("127.0.0.1")
                || host.endsWith("oculus.com")
                || host.endsWith("meta.com")
                || host.endsWith("facebook.com")
                || host.endsWith("instagram.com");
    }

    /**
     * A Download link: the relay URL carries the real store URL in ?url=. Hand
     * that to the system downloader with the companion app's User-Agent, which
     * is what the relay would have added.
     */
    /** A site download link goes through the relay; the store URL is in its ?url=. */
    private static String target(String url) {
        String t = Uri.parse(url).getQueryParameter("url");
        return t != null ? t : url;
    }

    private void download(String url, String ua, String disposition, String mime, long length) {
        String target = target(url);
        String name = URLUtil.guessFileName(target, disposition, mime);
        try {
            DownloadManager.Request r = new DownloadManager.Request(Uri.parse(target));
            r.addRequestHeader("User-Agent", Relay.OCMS_UA);
            r.setTitle(name);
            r.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            r.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
            ((DownloadManager) getSystemService(DOWNLOAD_SERVICE)).enqueue(r);
            toast("Downloading " + name);
        } catch (Exception e) {
            toast("Could not start the download: " + e.getMessage());
        }
    }

    /** When an APK finishes, open the installer on it. Anything else just says where it went. */
    private final BroadcastReceiver downloaded = new BroadcastReceiver() {
        @Override
        public void onReceive(Context ctx, Intent intent) {
            long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
            String name = null;
            int status = 0;
            try (Cursor c = dm.query(new DownloadManager.Query().setFilterById(id))) {
                if (c != null && c.moveToFirst()) {
                    name = c.getString(c.getColumnIndexOrThrow(DownloadManager.COLUMN_TITLE));
                    status = c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
                }
            }
            if (name == null) return;
            if (status != DownloadManager.STATUS_SUCCESSFUL) {
                toast(name + " did not download");
                return;
            }
            if (!name.toLowerCase().endsWith(".apk")) {
                toast(name + " saved to Downloads");
                return;
            }
            Intent install = new Intent(Intent.ACTION_VIEW)
                    .setDataAndType(dm.getUriForDownloadedFile(id), "application/vnd.android.package-archive")
                    .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            try {
                startActivity(install);
            } catch (Exception e) {
                toast(name + " saved to Downloads");
            }
        }
    };

    private void toast(String text) {
        runOnUiThread(() -> Toast.makeText(this, text, Toast.LENGTH_LONG).show());
    }
}
