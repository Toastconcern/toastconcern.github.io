/* MetaDB on meta.com's store pages (www.meta.com/experiences/…).

   Some apps' pages on meta.com never draw: meta.com answers "This page isn't
   available" for apps its web store does not list (system apps such as
   Horizon Worlds or Meta Quest TV, and others), though the store itself still
   has them — the Meta Horizon phone app shows them fine.

   On such a page this draws the app itself, in meta.com's own app-page layout:
   the store's header and menu, the trailer and screenshots with the buy card
   beside them, then About and Additional details. The data comes from the
   extension's background worker, which reads it the phone app's way. Nothing
   is asked of the store on a page that loads. */

const LOOK_FOR = 10000; // how long meta.com gets to draw a page that shows nothing at all, in ms
const BROKEN =
  /this page isn['’]t available|page (?:isn['’]t|is not) available|this content isn['’]t available|no longer available/i;

/** { id, kind } for an app page — kind is "pcvr", "go" or "quest" — or null. */
function pageApp() {
  const m = /^\/experiences\/(?:(pcvr|go|rift)\/)?(?:[^/]+\/)?(\d{6,})\/?$/.exec(location.pathname);
  if (!m) return null;
  return { id: m[2], kind: m[1] === "rift" ? "pcvr" : m[1] ?? "quest" };
}

/** "error" when meta.com says the page is not available, "blank" when it drew nothing, else null. */
function failure() {
  const text = document.body?.innerText ?? "";
  if (BROKEN.test(text)) return "error";
  return !document.querySelector("h1") && text.trim().length < 400 ? "blank" : null;
}

/* ---------- the page's state ---------- */

let current = null; // the app this page is about
let host = null; // the element the drawn page lives in
let hidden = []; // meta.com's own nodes put away while it shows
let watch = null; // the timer waiting on meta.com's page

/* meta.com changes pages without reloading, so the address is watched. */
let lastPath = null;
setInterval(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    arrive();
  }
}, 500);

function arrive() {
  clearTimeout(watch);
  restore();
  current = pageApp();
  if (!current) return;
  const started = Date.now();
  const look = () => {
    if (!current || host) return;
    const why = failure();
    if (why === "error" || (why === "blank" && Date.now() - started >= LOOK_FOR)) return draw();
    if (Date.now() - started < LOOK_FOR) watch = setTimeout(look, 700);
  };
  watch = setTimeout(look, 700);
}

function restore() {
  host?.remove();
  host = null;
  for (const [node, display] of hidden) node.style.display = display;
  hidden = [];
}

/* ---------- a little DOM helper ---------- */

/** h("div.cls", { attr }, ...children) — text children are set as text, never parsed. */
function h(tag, attrs, ...kids) {
  const [name, ...classes] = tag.split(".");
  const svg = name === "svg" || name === "path" || name === "circle";
  const node = svg ? document.createElementNS("http://www.w3.org/2000/svg", name) : document.createElement(name);
  if (classes.length) node.setAttribute("class", classes.join(" "));
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? "" : String(v));
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid === null || kid === undefined || kid === false) continue;
    node.append(kid instanceof Node ? kid : String(kid));
  }
  return node;
}

/* Only the store's own CDN addresses are put in the page. */
const safeUrl = (u) =>
  typeof u === "string" && /^https:\/\/[^/]+\.(fbcdn\.net|fbsbx\.com|oculuscdn\.com|facebook\.com|oculus\.com|meta\.com)\//.test(u) ? u : null;
const safeLink = (u) => (typeof u === "string" && /^https?:\/\//.test(u) ? u : null);

/* Outline icons in meta.com's style, 24px boxes. */
const icon = (d, size = 24) =>
  h("svg", { viewBox: "0 0 24 24", width: size, height: size, fill: "none", stroke: "currentColor", "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, h("path", { d }));
const ICONS = {
  search: "M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM16 16l5 5",
  bag: "M5 8h14l-1 13H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  chevron: "M6 9l6 6 6-6",
  share: "M14 5l7 7-7 7M21 12H9a6 6 0 0 0-6 6",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z",
  play: "M8 5l11 7-11 7V5Z",
};

/* ---------- styles: measured off meta.com's own app page ---------- */

const CSS = `
:host { all: initial; display: block; }
* { box-sizing: border-box; }
.page {
  --text: #0a1317; --body: #1c1e21; --muted: #5d6c7b; --line: #dee3e9; --blue: #0457cb;
  --edge: rgba(10, 19, 23, .45); --tab: #0064e0;
  font-family: "Optimistic VF", "Optimistic Text", Montserrat, Helvetica, Arial, "Noto Sans", sans-serif;
  color: var(--body); background: #fff; font-size: 12px; line-height: 1.34; min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
a:focus-visible, button:focus-visible { outline: 2px solid var(--tab); outline-offset: 2px; }
svg { flex-shrink: 0; }

/* the site header */
.top { display: flex; align-items: center; height: 64px; padding: 0 32px; }
.logo { display: flex; align-items: center; width: 61px; height: 14px; margin-right: 40px; }
.logo img { height: 14px; }
.logo span { font-size: 15px; font-weight: 600; color: var(--text); }
.top .links { display: flex; gap: 12px; }
.top .links a, .top .end a { font-size: 14px; line-height: 20px; color: var(--text); padding: 6px 12px; border-radius: 24px; }
.top .links a:hover, .top .end a:hover { background: #f1f4f7; }
.top .end { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.top .end .ico { padding: 4px 6px; color: var(--text); display: flex; }

/* the store's menu */
.sub { display: flex; align-items: center; height: 84px; padding: 0 32px; border-bottom: 1px solid var(--line); }
.sub nav { display: flex; gap: 24px; align-self: stretch; }
.sub nav a { display: flex; align-items: center; font-size: 16px; line-height: 24px; color: var(--text); border-bottom: 2px solid transparent; padding-top: 2px; }
.sub nav a.on { border-bottom-color: var(--tab); }
.sub .find { margin-left: auto; display: flex; height: 60px; }
.sub .platform { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 16px; width: 150px; font-size: 16px; color: var(--text); white-space: nowrap;
  border: 1px solid var(--edge); border-radius: 12px 0 0 12px; }
.sub .search { display: flex; align-items: center; gap: 14px; width: 287px; padding: 0 16px; border: 1px solid var(--edge); border-left: 0;
  border-radius: 0 12px 12px 0; font-size: 16px; color: #606770; white-space: nowrap; overflow: hidden; }

/* the app */
.app { display: grid; grid-template-columns: minmax(0, 1fr) 432px; column-gap: 32px; padding: 48px 32px 80px; align-items: start; }
@media (max-width: 1000px) { .app { grid-template-columns: 1fr; } .card { grid-row: 1; margin-bottom: 24px; } }
.main { padding-top: 12px; min-width: 0; }
.stage { aspect-ratio: 16 / 9; background: #000; overflow: hidden; }
.stage img, .stage video { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumbs { display: flex; gap: 8px; margin-top: 14px; overflow: hidden; }
.thumbs button { flex: 0 0 152px; padding: 2px; border: 2px solid transparent; border-radius: 8px; position: relative; }
.thumbs button.on { border-color: #1877f2; }
.thumbs img { display: block; width: 144px; height: 84px; object-fit: cover; border-radius: 4px; }
.thumbs .play { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; }
.thumbs .play svg { width: 34px; height: 34px; padding: 8px; border-radius: 50%; background: rgba(0,0,0,.45); fill: #fff; stroke: none; }

.tabs { display: flex; gap: 32px; margin-top: 60px; border-bottom: 1px solid var(--line); }
.tabs a { font-size: 14px; line-height: 20px; color: var(--text); padding: 12px 0; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.desc { margin-top: 32px; font-size: 16px; line-height: 24px; color: var(--text); }
.desc .body { overflow: hidden; }
.desc .body.clip { max-height: 190px; }
.desc h2 { font-size: 18px; line-height: 26px; font-weight: 700; margin: 0 0 16px; }
.desc p { margin: 0 0 16px; white-space: pre-line; }
.desc ul { margin: 0 0 16px; padding-left: 24px; }
.more { font-size: 16px; line-height: 24px; font-weight: 700; color: var(--blue); }

.section { font-size: 28px; line-height: 34px; font-weight: 300; color: var(--text); margin: 72px 0 36px; }
.rows { display: grid; grid-template-columns: 310px minmax(0, 1fr); column-gap: 77px; row-gap: 10px; margin-left: -16px; }
.rows > div { padding: 0 16px 24px; border-bottom: 1px solid var(--line); font-size: 16px; line-height: 24px; color: var(--text); }
.rows .v.hl { font-weight: 700; color: var(--blue); }
.rows a { color: var(--blue); text-decoration: underline; }

/* the buy card */
.card { border: 1px solid var(--line); border-radius: 8px; padding: 24px; position: sticky; top: 24px; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; margin: 0 0 12px -8px; border-radius: 4px;
  font-size: 12px; line-height: 16px; font-weight: 700; color: var(--text); }
h1 { margin: 0; font-size: 24px; line-height: 30px; font-weight: 500; color: var(--text); }
.rating { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-top: 12px; font-size: 14px; line-height: 20px; color: var(--muted); }
.rating svg { width: 16px; height: 16px; fill: var(--muted); stroke: none; }
.rating b { font-weight: 700; }
.rating u { text-underline-offset: 2px; }
.acts { display: flex; gap: 8px; margin-top: 12px; }
.acts button { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 4px 8px; border: 1px solid var(--line); border-radius: 8px;
  font-size: 14px; line-height: 20px; color: var(--text); }
.acts svg { width: 16px; height: 16px; }
.age { display: flex; gap: 8px; margin-top: 12px; }
.age img { width: 34px; height: 34px; object-fit: contain; }
.age b { display: block; font-size: 16px; line-height: 20px; font-weight: 700; color: var(--text); text-decoration: underline; }
.age span { display: block; font-size: 14px; line-height: 20px; color: var(--muted); }
.note { margin-top: 16px; font-size: 14px; line-height: 20px; color: var(--muted); }
.buy { display: flex; align-items: center; justify-content: center; width: 100%; height: 44px; margin-top: 16px; padding: 10px 22px;
  border-radius: 100px; background: var(--blue); color: #fff; font-size: 14px; line-height: 20px; font-weight: 700; }
.buy.done { background: #e4e6eb; color: var(--text); }
.buy s { font-weight: 400; opacity: .8; margin-left: 8px; }

.status { padding: 120px 32px; text-align: center; font-size: 16px; line-height: 24px; color: var(--text); }
.status.bad { color: #b3261e; }
.credit { margin-top: 48px; font-size: 12px; color: var(--muted); }
`;

function sheet(text) {
  /* A constructed sheet, not a <style>: it is not refused by the page's own
     style rules, and stays inside the shadow root. */
  const s = new CSSStyleSheet();
  s.replaceSync(text);
  return s;
}

/* ---------- the store's chrome ---------- */

function header(kind) {
  /* meta.com's own logo, from the page that failed, when it is there. */
  const logo = document.querySelector('a[aria-label="Meta home"] img, header img, img[src*="rsrc.php"][src$=".svg"]');
  const platform = kind === "pcvr" ? "Link PC VR" : "Meta Quest";
  return [
    h("div.top", null,
      h("a.logo", { href: "/", "aria-label": "Meta home" }, logo?.src ? h("img", { src: logo.src, alt: "" }) : h("span", null, "Meta")),
      h("div.links", null,
        h("a", { href: "/ai-glasses/" }, "AI glasses"),
        h("a", { href: "/quest/" }, "Meta Quest"),
        h("a", { href: "/vr-glasses/" }, "Meta VR Glasses"),
        h("a", { href: "/muse-charm/" }, "Muse Charm")),
      h("div.end", null,
        h("a", { href: "/about/" }, "Explore Meta"),
        h("a", { href: "/help/" }, "Support"),
        h("a.ico", { href: "/experiences/search/", "aria-label": "Search" }, icon(ICONS.search, 26)),
        h("a.ico", { href: "/bag/", "aria-label": "View bag items" }, icon(ICONS.bag, 26)),
        h("a.ico", { href: "/my/", "aria-label": "Account" }, icon(ICONS.user, 26)))),
    h("div.sub", null,
      h("nav", { "aria-label": "Store" },
        h("a.on", { href: "/experiences/view/1321443348416166/" }, "Home"),
        h("a", { href: "/experiences/view/777072216186618/" }, "Games"),
        h("a", { href: "/experiences/view/777073612853145/" }, "Apps"),
        h("a", { href: "/experiences/meta-horizon-plus/" }, "Horizon+"),
        h("a", { href: "/experiences/section/1694291617673045/" }, "Wishlist")),
      h("div.find", null,
        h("div.platform", null, platform, icon(ICONS.chevron, 18)),
        h("a.search", { href: "/experiences/search/" }, icon(ICONS.search, 24), `Search ${kind === "pcvr" ? "Link PC VR" : "apps, games and more"}`))),
  ];
}

/* ---------- drawing ---------- */

function draw() {
  if (!current || host) return;
  const app = current;
  /* meta.com's error page is put away, not removed, so leaving puts it back. */
  hidden = [...document.body.children].map((n) => [n, n.style.display]);
  for (const [n] of hidden) n.style.display = "none";
  host = h("div", { "data-metadb": "store" });
  const shadow = host.attachShadow({ mode: "closed" });
  shadow.adoptedStyleSheets = [sheet(CSS)];
  const body = h("div", null, h("p.status", { role: "status" }, "Loading…"));
  shadow.append(h("div.page", null, header(app.kind), body));
  document.body.append(host);
  window.scrollTo(0, 0);

  chrome.runtime.sendMessage({ type: "store-item", id: app.id, kind: app.kind }, (answer) => {
    if (current !== app || !host) return;
    if (chrome.runtime.lastError || !answer) {
      return body.replaceChildren(h("p.status.bad", { role: "status" }, "MetaDB could not load this app. Reload the page to try again."));
    }
    if (answer.error) {
      return body.replaceChildren(
        h("p.status.bad", { role: "status" }, answer.error,
          answer.login ? [" ", h("a", { href: "https://secure.oculus.com/my/profile/", style: "text-decoration:underline" }, "Log in")] : null)
      );
    }
    document.title = `${answer.item.name} on ${answer.item.kind === "pcvr" ? "Oculus Rift" : "Meta Quest"} | Meta Store`;
    body.replaceChildren(render(answer.item));
  });
}

function gallery(item) {
  const media = [];
  const poster = safeUrl(item.hero) ?? safeUrl(item.landscape) ?? safeUrl(item.screenshots?.[0]);
  if (safeUrl(item.trailer)) media.push({ kind: "video", uri: item.trailer, poster });
  for (const s of item.screenshots ?? []) if (safeUrl(s)) media.push({ kind: "image", uri: s });
  if (!media.length && poster) media.push({ kind: "image", uri: poster });

  const stage = h("div.stage");
  const thumbs = h("div.thumbs");
  const show = (m, button, play) => {
    stage.replaceChildren(
      m.kind === "video"
        ? h("video", { src: m.uri, poster: m.poster, controls: true, playsinline: true, preload: "metadata", autoplay: play })
        : h("img", { src: m.uri, alt: "" })
    );
    for (const b of thumbs.children) b.classList.toggle("on", b === button);
  };
  media.forEach((m, i) => {
    const still = m.kind === "video" ? m.poster : m.uri;
    const b = h("button", { type: "button", "aria-label": m.kind === "video" ? "Play trailer" : `Picture ${i + 1}` },
      still ? h("img", { src: still, alt: "", loading: "lazy" }) : null,
      m.kind === "video" ? h("span.play", null, icon(ICONS.play, 34)) : null);
    b.addEventListener("click", () => show(m, b, true));
    thumbs.append(b);
  });
  if (media.length) show(media[0], thumbs.firstChild, false);
  return [stage, media.length > 1 ? thumbs : null];
}

/** The description as meta.com sets it: "#" lines are headings, "- " lines are lists. */
function description(text, markdown) {
  const out = [];
  let list = null;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    const bullet = markdown && /^[-*•]\s+/.test(line);
    if (!bullet) list = null;
    if (!line) continue;
    if (markdown && /^#{1,6}\s+/.test(line)) out.push(h("h2", null, line.replace(/^#+\s+/, "").replace(/\*\*/g, "")));
    else if (markdown && /^\*\*[^*]+\*\*$/.test(line)) out.push(h("h2", null, line.slice(2, -2)));
    else if (bullet) {
      if (!list) out.push((list = h("ul")));
      list.append(h("li", null, line.replace(/^[-*•]\s+/, "").replace(/\*\*/g, "")));
    } else out.push(h("p", null, markdown ? line.replace(/\*\*/g, "") : line));
  }
  return out;
}

function render(item) {
  const genres = item.genres ?? [];
  const priceText = item.owned ? "Purchased" : item.comingSoon ? "Coming soon" : item.price || (item.free ? "Free" : null);

  const card = h("aside.card", null,
    h("h1", null, item.name),
    item.rating || genres.length
      ? h("div.rating", null,
          item.rating ? [icon(ICONS.star, 16), h("b", null, item.rating)] : null,
          item.ratingCount ? h("u", null, `(${item.ratingCount})`) : null,
          genres.length ? `${item.rating ? " • " : ""}${genres.join(" • ")}` : null)
      : null,
    h("div.acts", null,
      h("button", { type: "button", onclick: (e) => navigator.clipboard?.writeText(location.href).then(() => (e.currentTarget.lastChild.textContent = "Copied")) },
        icon(ICONS.share, 16), h("span", null, "Share"))),
    safeUrl(item.ageImage) || item.ageText
      ? h("div.age", null,
          safeUrl(item.ageImage) ? h("img", { src: item.ageImage, alt: "" }) : null,
          h("div", null, h("b", null, item.ageText ?? "Rating"), item.ageNote ? h("span", null, item.ageNote) : null))
      : null,
    item.preorder ? h("p.note", null, "Pre-order") : null,
    priceText
      ? h("div.buy" + (item.owned ? ".done" : ""), null, priceText, item.was && item.was !== priceText && !item.owned ? h("s", null, item.was) : null)
      : null
  );

  const main = h("div.main", null, gallery(item));

  const tabs = h("div.tabs", null);
  main.append(tabs);
  if (item.long || item.short) {
    tabs.append(h("a", { href: "#description" }, "About"));
    const body = h("div.body", null, description(item.long || item.short, item.markdown));
    const desc = h("div.desc", { id: "description" }, body);
    main.append(desc);
    requestAnimationFrame(() => {
      if (body.scrollHeight <= 230) return;
      body.classList.add("clip");
      const more = h("button.more", { type: "button" }, "more...");
      more.addEventListener("click", () => {
        const open = body.classList.toggle("clip");
        more.textContent = open ? "more..." : "less";
      });
      desc.append(more);
    });
  }

  const link = (url, text) => (safeLink(url) ? h("a", { href: url, target: "_blank", rel: "noopener nofollow" }, text ?? url) : null);
  const rows = [
    ["Game modes", item.modes?.join(", ")],
    ["Supported player modes", item.playerModes?.join(", "), true],
    ["Supported controllers", item.controllers?.join(", ")],
    ["Supported platforms", item.platforms?.join(", "), true],
    ["Category", item.category],
    ["Genres", genres.join(", ")],
    ["Languages", item.languages?.join(", ")],
    ["Version", item.version],
    ["Developer", item.developer],
    ["Publisher", item.publisher],
    ["Website", link(item.website)],
    ["Release date", item.released],
    ["Developer Privacy Policy", link(item.privacyUrl, "Privacy Policy")],
    ["Developer Terms of Service", link(item.termsUrl, "Terms of Service")],
    ["Space required", item.size, true],
    ["Comfort level", item.comfort, true],
    ["Internet connection", item.internet],
  ].filter(([, v]) => v);
  if (rows.length) {
    tabs.append(h("a", { href: "#details" }, "More"));
    main.append(
      h("div.section", { id: "details" }, "Additional details"),
      h("div.rows", null, rows.map(([k, v, hl]) => [h("div", null, k), h("div.v" + (hl ? ".hl" : ""), null, v)]))
    );
  }
  main.append(h("p.credit", null, "Shown by the MetaDB extension from Meta's store data, because meta.com could not show this page."));

  return h("div.app", null, main, card);
}
