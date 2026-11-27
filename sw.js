// 앱으로 설치했을 때 빠르게 열리도록: 영상·이미지·스티커·글꼴은 기기에 저장해 두고(cache-first),
// 화면 코드(html/js)는 항상 새 버전을 먼저 받아요(network-first, 인터넷이 끊기면 저장본).
// 사진 업로드·다운로드·관리자(/api, /p, /img, /admin)는 건드리지 않아요.
const VERSION = "v1";
const STATIC = "static-" + VERSION, PAGES = "pages-" + VERSION;
const PRECACHE = ["./", "index.html", "config.js", "frames.js", "vendor/qrcode.js", "manifest.webmanifest",
  "media/home-intro.mp4", "media/home-loop.mp4", "media/home-intro.jpg", "media/home-loop.jpg",
  "assets/jesus/1.png", "assets/jesus/2.png", "assets/jesus/3.png", "assets/jesus/4.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC).then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== STATIC && k !== PAGES).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.origin === location.origin && /^\/(api|p|img|admin)(\/|$)/.test(url.pathname)) return;
  if (req.headers.has("range")) return;   // 영상 구간 요청은 브라우저에 맡김
  const isMedia = url.origin === location.origin && /^\/(media|assets|stickers|icon)/.test(url.pathname) || /fonts\.(gstatic|googleapis)\.com$/.test(url.hostname);
  if (isMedia) {
    e.respondWith(caches.open(STATIC).then(async c => (await c.match(req, { ignoreSearch: true })) || fetch(req).then(r => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; })));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(r => { if (r.ok) caches.open(PAGES).then(c => c.put(req, r.clone())); return r; })
    .catch(async () => (await caches.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? caches.match("index.html") : Response.error())));
});
