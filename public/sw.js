// let cacheData = "appV1";
// this.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(cacheData).then((cache) => {
//       cache.addAll([
//         "/static/js/bundle.js",
//         "/static/main.chunk.js",
//         "/static/0.chunk.js",
//         "/index.html",
//         "/",
//         "/login",
//         "/status",
//       ]);
//     })
//   );
// });

// this.addEventListener("fetch", (event) => {
//   if (!navigator.onLine) {
//     event.respondWith(
//       caches.match(event.request).then((res) => {
//         if (res) {
//           return res;
//         }
//         let requestUrl = event.request.clone();
//         fetch(requestUrl);
//       })
//     );
//   }
// });
// this.addEventListener('fetch', event => {

// 	event.respondWith(
// 		caches.match(event.request).then(function (response) {
// 			return response || fetch(event.request).then(res =>
// 				// 存 caches 之前，要先打開 caches.open(dataCacheName)
// 				caches.open(dataCacheName)
// 				.then(function(cache) {
// 					// cache.put(key, value)
// 					// 下一次 caches.match 會對應到 event.request
// 					cache.put(event.request, res.clone());
// 					return res;
// 				})
// 			);
// 		})
// 	);
// });
