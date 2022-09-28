export default async function swDev() {
  let swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
  await navigator.serviceWorker.register(swUrl).then((res) => {
    console.log("res", res);
  });
  await navigator.serviceWorker.ready;
}
