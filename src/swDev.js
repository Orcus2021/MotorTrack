const swDev = () => {
  let swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;

  return new Promise(async (resolve) => {
    const sw = await navigator.serviceWorker.register(swUrl);
    resolve(sw);
  });
};

export default swDev;
