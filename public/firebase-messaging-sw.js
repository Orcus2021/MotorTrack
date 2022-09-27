importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDc2tuIBAOCWM1TcRwk8M5GMzBCDQAynKc",
  authDomain: "motortrack-97569.firebaseapp.com",
  projectId: "motortrack-97569",
  storageBucket: "motortrack-97569.appspot.com",
  messagingSenderId: "899173634521",
  appId: "1:899173634521:web:24142760923e9cddfe09c8",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

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
  if (
    event.request.url.indexOf("firestore.googleapis.com") === -1 &&
    event.request.url.indexOf("chrome-extension") === -1
  ) {
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

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  this.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "logo192.png",
  });
});
// self.addEventListener('fetch',function(e){

//   e.respondWith(
//   caches.match(e.request).then(function(resp) {
//       console.log("Response from Cache",resp)
//       return resp || fetch(e.request)
//       .then(function(response) {
//           return caches.open(cacheName).then(function(cache)
//           {
//            cache.put(e.request,response.clone());
//            return response;
//           });
//      });
//   })
//   .catch(function() {
//     return console.log("Error Fallback");
//   })
// );
// })
