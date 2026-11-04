const CACHE="finals-bakery-v2";
const ASSETS=["./", "index.html", "manifest.webmanifest", "img/bagel-wheels.webp", "img/bagel.webp", "img/baguette.webp", "img/breakfast.webp", "img/butter.webp", "img/cookie-bite.webp", "img/cookie.webp", "img/croissant-coffee.webp", "img/croissant.webp", "img/donut.webp", "img/fruit-tart.webp", "img/milk.webp", "img/moon.webp", "img/muffin-blueberry.webp", "img/muffin-choc.webp", "img/night-strip.webp", "img/night.webp", "img/pudding-doily.webp", "img/pudding.webp", "img/rollcake-strawberry.webp", "img/rollcake.webp", "img/sandwich.webp", "img/scene-bagel-friends.webp", "img/scene-baking-together.webp", "img/scene-bread-dome.webp", "img/scene-cafe-table.webp", "img/scene-cat-eggtart.webp", "img/scene-cinnamon-roll.webp", "img/scene-croissant-nap.webp", "img/scene-eclair-tray.webp", "img/scene-melonpan-tray.webp", "img/scene-puppy-baguette.webp", "img/scene-strawberry-jelly.webp", "img/scene-waffle-stack.webp", "img/toast-butter.webp", "img/toast-strawberry.webp", "img/txt-cozy-morning.webp", "img/txt-sweet-day.webp", "img/txt-take-it-slow.webp", "img/waffle.webp", "icons/apple-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    // the page itself: network first so updates show up, cache when offline
    if(req.mode==="navigate"){ e.respondWith(fetch(req).then(r=>{const cp=r.clone(); caches.open(CACHE).then(c=>c.put("index.html",cp)); return r;}).catch(()=>caches.match("index.html"))); return; }
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{const cp=r.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); return r;})));
    return;
  }
  if(url.hostname.endsWith("fonts.googleapis.com")||url.hostname.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req).then(hit=>{const net=fetch(req).then(r=>{c.put(req,r.clone()); return r;}).catch(()=>hit); return hit||net;})));
  }
});
