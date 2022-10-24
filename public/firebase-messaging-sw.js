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

const messaging = firebase.messaging();

let cacheData = "appV1.3";
const dynamicCache = "appV1.3-dynamic";
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
          return caches.delete(item);
        }
      });
      return Promise.all(promiseArr);
    })
  );
});

this.addEventListener("fetch", (event) => {
  if (
    event.request.url.indexOf("firestore.googleapis.com") === -1 &&
    event.request.url.indexOf("chrome-extension") === -1 &&
    event.request.method !== "POST"
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((res) =>
            caches.open(dynamicCache).then(function (cache) {
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
  console.log(payload);
  this.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "logo192.png",
  });
});
