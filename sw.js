const CACHE = "norte-padel-v92-shell";
const APP_SHELL = ["./","./index.html","./style.css","./v92-final.css?v=92","./app.js","./matching.js","./manifest.json","./icon-192.png","./icon-512.png","./icon-512-maskable.png"];
self.addEventListener("install", event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).catch(()=>{}));self.skipWaiting();});
self.addEventListener("activate", event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch", event=>{
  const u=new URL(event.request.url);
  if(u.origin!==self.location.origin||event.request.method!=="GET") return;
  // Network first for HTML/CSS/JS so GitHub Pages deployments are not stuck on stale assets.
  const path=u.pathname;
  const networkFirst=/\/($|index\.html$|config\.js$|.*\.css$|.*\.js$|manifest\.json$)/i.test(path);
  event.respondWith((async()=>{
    try{const res=await fetch(event.request); if(networkFirst && res.ok){ const c=await caches.open(CACHE); c.put(event.request,res.clone()).catch(()=>{});} return res;}
    catch{return caches.match(event.request);}
  })());
});
