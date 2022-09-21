import React, { useState, useEffect } from "react";
import firebase from "./utils/firebase";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyDc2tuIBAOCWM1TcRwk8M5GMzBCDQAynKc",
  authDomain: "motortrack-97569.firebaseapp.com",
  projectId: "motortrack-97569",
  storageBucket: "motortrack-97569.appspot.com",
  messagingSenderId: "899173634521",
  appId: "1:899173634521:web:24142760923e9cddfe09c8",
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// export const ConnectForm = ({ children }) => {

//   return children({ ...kkkkk });
// };

const Test = () => {
  useEffect(() => {
    const getMessageToken = async () => {
      const response = await firebase.getMessageToken().catch((msg) => {
        console.log(msg);
      });
    };

    const requestPermission = () => {
      console.log("Requesting permission...");
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          getMessageToken();
        }
      });
    };

    requestPermission();
  }, []);

  firebase.onMessageFromFCM().then((payload) => {
    console.log(payload);
  });

  return <div>TEST</div>;
};

export default Test;
