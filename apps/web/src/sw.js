// import { manifest, version } from '@parcel/service-worker'
//
// async function install() {
//   const cache = await caches.open(version)
//   await cache.addAll(manifest)
// }

addEventListener('install', (e) => {
  // eslint-disable-next-line no-console
  console.log('e', e)
  // install()
})

// /* eslint-disable no-restricted-globals */
// const cacheName = 'finanso-cache-sw';
// const filesToCache = ['{--what-change--}'];
// self.addEventListener('install', e => {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(cacheName).then(cache => {
//       console.log('[ServiceWorker] Caching app shell');
//       return cache.addAll(filesToCache);
//     }),
//   );
// });
// self.addEventListener('activate', event => {
//   event.waitUntil(self.clients.claim());
// });
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches
//       .match(event.request, { ignoreSearch: true })
//       .then(response => response || fetch(event.request)),
//   );
// });
