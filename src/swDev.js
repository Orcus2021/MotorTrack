// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyDc2tuIBAOCWM1TcRwk8M5GMzBCDQAynKc",
//   authDomain: "motortrack-97569.firebaseapp.com",
//   projectId: "motortrack-97569",
//   storageBucket: "motortrack-97569.appspot.com",
//   messagingSenderId: "899173634521",
//   appId: "1:899173634521:web:24142760923e9cddfe09c8",
// };
// const messageKey =
//   "BMfPfF3tRqWFQxHBkwVfqa3-4xipfWPrTlq5Jo4CfQI-Z_egT-Cz16CCXKL_7njrfewWi5g_t5crdSfI2V06TwE";
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

const swDev = () => {
  let swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;

  return new Promise(async (resolve) => {
    const sw = await navigator.serviceWorker.register(swUrl);
    resolve(sw);
  });

  // navigator.serviceWorker.register(swUrl).then(async (res) => {
  //   console.log("sw", res);
  // const token = await getToken(messaging, {
  //   vapidKey: messageKey,
  //   serviceWorkerRegistration: res,
  // });
  // console.log("TOKEN", token);
  // });
};
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.getRegistration().then(async (reg) => {
//     const token = await messaging.getToken({
//       vapidKey: messageKey,
//       serviceWorkerRegistration: reg,
//     });
//     console.log("TOKEN", token);
//     notificationsService.subscribeUser(token);
//   });
// }
export default swDev;
