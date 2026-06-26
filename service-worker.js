const CACHE_NAME = 'qiangren-v2';  // 新版本号可强制更新

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
  // 清理旧缓存
  caches.keys().then(names => {
    names.forEach(name => {
      if (name !== CACHE_NAME) caches.delete(name);
    });
  });
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 仅缓存成功请求，且忽略 chrome-extension 等
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // 离线时使用缓存
  );
});