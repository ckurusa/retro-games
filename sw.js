// 서비스 워커: 설치형 앱(허브)을 위한 최소 구현.
// 네트워크가 되면 항상 최신 파일을 받고(게임을 고쳐 올리면 바로 반영), 안 되면 저장해 둔 것으로 열어 준다(오프라인).
// 허브와 게임 파일은 설치할 때 미리 저장하고, 이후 방문하는 파일은 그때그때 저장한다.
const VERSION = 'v1';
const CACHE = 'retro-games-' + VERSION;
const CORE = ['./', 'index.html', 'games.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const NET_TIMEOUT = 6000;      // 이 시간 안에 응답이 없으면 저장해 둔 것으로 연다

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(u => cache.add(u).catch(() => { /* 일부 실패해도 설치는 계속 */ })));
    try {                                          // games.js에 적힌 게임 경로를 읽어 게임 파일도 미리 저장
      const text = await (await fetch('games.js', { cache: 'no-cache' })).text();
      const paths = [...text.matchAll(/path:\s*'([^']+)'/g)].map(m => m[1]);
      await Promise.all(paths.map(p => cache.add(p).catch(() => { /* 게임 하나 실패해도 계속 */ })));
    } catch (err) { /* 오프라인이면 건너뜀 */ }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('retro-games-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), NET_TIMEOUT);
    const res = await fetch(req, { signal: ctl.signal, cache: 'no-cache' }); clearTimeout(t);
    if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') { const home = await cache.match('index.html'); if (home) return home; }
    return new Response('오프라인이에요. 인터넷에 연결한 뒤 다시 열어 주세요.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;       // 다른 사이트 요청은 건드리지 않는다
  if (req.destination === 'image' || /\.(png|jpg|jpeg|svg|ico|webp)$/i.test(url.pathname)) e.respondWith(cacheFirst(req));
  else e.respondWith(networkFirst(req));
});
