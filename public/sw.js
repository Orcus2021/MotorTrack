let cacheData = "appV1";
const dynamicCache = "appV1-dynamic";
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      return cache.addAll([
        "/static/js/bundle.js",
        "/static/main.chunk.js",
        "/static/media/**.png",
        "/static/0.chunk.js",
        "/index.html",
        "/",
        "/status",
        "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Kanit:wght@600;700;800&family=Noto+Sans+TC&family=Poppins&display=swap",
      ]);
    })
  );
});

this.addEventListener("activate", (event) => {
  console.log("now ready to handle fetches!");
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      let promiseArr = cacheNames.map((item) => {
        if (item !== cacheData) {
          // Delete that cached file
          return caches.delete(item);
        }
      });
      return Promise.all(promiseArr);
    })
  ); // end e.waitUntil
});

this.addEventListener("fetch", (event) => {
  if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((res) =>
            // 存 caches 之前，要先打開 caches.open(dataCacheName)
            caches.open(dynamicCache).then(function (cache) {
              // cache.put(key, value)
              // 下一次 caches.match 會對應到 event.request
              cache.put(event.request, res.clone());
              return res;
            })
          )
        );
      })
    );
  }
});
