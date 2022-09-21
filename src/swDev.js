export default function swDev() {
  let swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
  navigator.serviceWorker.register(swUrl).then((res) => {
    console.log("res", res);
  });
}
