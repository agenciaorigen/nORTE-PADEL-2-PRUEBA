const CACHE = "norte-padel-v70-circuit";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./config.js",
  "./app.js",
  "./matching.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./hero-cancha.webp",
  "./brasil-tour.webp",
  "./destacados-fondo.webp",
  "./pelotas.webp",
  "./editorial-action-01.webp",
  "./editorial-action-02.webp",
  "./editorial-action-03.webp",
  "./editorial-action-04.webp",
  "./editorial-action-05.webp",
  "./editorial-court-01.webp",
  "./editorial-net.webp",
  "./editorial-community.webp",
  "./hero-torneos.webp",
  "./hero-ranking.webp",
  "./norte-editorial-01.webp",
  "./norte-editorial-02.webp",
  "./norte-editorial-03.webp",
  "./norte-editorial-04.webp",
  "./norte-editorial-05.webp",
  "./norte-editorial-06.webp",
  "./norte-editorial-03-square.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first para el shell, red primero para todo lo demás (datos de Supabase siempre frescos)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});

// Notificaciones push reales (cuando el organizador configure el envío server-side con VAPID)
self.addEventListener("push", (event) => {
  let data = { title: "Norte Padel", body: "Tenés una novedad en tu torneo." };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    data.body = event.data ? event.data.text() : data.body;
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Norte Padel", {
      body: data.body,
      icon: "icon-192.png",
      badge: "icon-192.png"
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow("./index.html");
    })
  );
});
