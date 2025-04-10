// 缓存版本和名称
const CACHE_VERSION = 'v1';
const CACHE_NAME = `navigation-cache-${CACHE_VERSION}`;

// 需要缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/script.js',
  '/assets/icons/default.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2'
];

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存：', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 网络请求拦截
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 返回缓存的资源（如果有）
        if (response) {
          return response;
        }
        
        // 没有缓存则请求网络
        return fetch(event.request)
          .then(response => {
            // 排除不需要缓存的请求
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 复制响应，一份用于缓存，一份用于返回
            const responseToCache = response.clone();
            
            // 更新缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // 当网络请求失败时，如果是导航请求，返回缓存中的index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
}); 