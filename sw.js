const CACHE = "norte-padel-v90-platform";
const APP_SHELL = [
  "./","./index.html","./style-v90-base.css","./v90-system.css","./app.js","./matching.js","./v90-app.js","./config.js","./manifest.json",
  "./icon-192.png","./icon-512.png","./icon-512-maskable.png","./hero-cancha.webp","./hero-ranking.webp","./hero-torneos.webp","./brasil-tour.webp","./destacados-fondo.webp","./pelotas.webp",
  "./editorial-action-01.webp","./editorial-action-02.webp","./editorial-action-03.webp","./editorial-action-04.webp","./editorial-action-05.webp","./editorial-court-01.webp","./editorial-net.webp","./editorial-community.webp",
  "./norte-editorial-01.webp","./norte-editorial-02.webp","./norte-editorial-03.webp","./norte-editorial-04.webp","./norte-editorial-05.webp","./norte-editorial-06.webp","./norte-editorial-03-square.webp","./pelotas.jpg"
];
self.addEventListener("install", event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).catch(()=>{}));self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",event=>{
  const u=new URL(event.request.url);
  if(u.origin!==self.location.origin||event.request.method!=="GET")return;
  event.respondWith((async()=>{try{const res=await fetch(event.request);const c=await caches.open(CACHE);c.put(event.request,res.clone()).catch(()=>{});return res;}catch{return caches.match(event.request);}})());
});
self.addEventListener("push",event=>{let data={title:"Norte Padel",body:"Tenés una novedad en tu torneo."};try{if(event.data)data=event.data.json();}catch{}event.waitUntil(self.registration.showNotification(data.title||"Norte Padel",{body:data.body,icon:"icon-192.png",badge:"icon-192.png"}));});
self.addEventListener("notificationclick",event=>{event.notification.close();event.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>cs.length?cs[0].focus():self.clients.openWindow("./index.html#/")));});
