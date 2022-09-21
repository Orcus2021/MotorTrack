importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// import { getMessaging, onMessage } from "firebase/messaging";
// import { onBackgroundMessage } from "firebase/messaging/sw";
// import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDc2tuIBAOCWM1TcRwk8M5GMzBCDQAynKc",
  authDomain: "motortrack-97569.firebaseapp.com",
  projectId: "motortrack-97569",
  storageBucket: "motortrack-97569.appspot.com",
  messagingSenderId: "899173634521",
  appId: "1:899173634521:web:24142760923e9cddfe09c8",
};

// const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  self.registration.showNotification("Background Message Title", {
    body: "Background Message body.",
  });
});

// onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
// Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//   };

//   this.registration.showNotification(notificationTitle, notificationOptions);
// });
// onMessage(messaging, (payload) => {
//   console.log("Message received. ", payload);
//   // const notificationTitle = "Message Title";
//   // const notificationOptions = {
//   //   body: "Message body.",
//   // };
//   // new Notification(notificationTitle, notificationOptions);
// });
