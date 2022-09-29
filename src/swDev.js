const swDev = () => {
  let swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;

  return new Promise(async (resolve) => {
    const sw = await navigator.serviceWorker.register(swUrl);
    resolve(sw);
  });
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
