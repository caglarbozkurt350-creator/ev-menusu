const SURUM = "ev-menusu-v2";
const KABUK = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/pdfmake.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/vfs_fonts.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(KABUK)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.hostname.endsWith("wikipedia.org")) return;
  if (u.pathname.includes("/beta/")) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const k = res.clone(); caches.open(SURUM).then(c => c.put("./index.html", k)); return res; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(h => h || fetch(r).then(res => {
    if (res.ok || res.type === "opaque") { const k = res.clone(); caches.open(SURUM).then(c => c.put(r, k)); }
    return res;
  }).catch(() => h)));
});
