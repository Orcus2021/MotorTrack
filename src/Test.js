import React, { useState, useEffect } from "react";
import firebase from "./utils/firebase";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { createMessage } from "./utils/calcFunc";
import moment from "moment";
import { useAppSelector, useAppDispatch } from "./store";
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
  const cars = useAppSelector((state) => state.car.cars);
  const dispatch = useAppDispatch();
  let messages = [];
  cars.forEach((car) => {
    const today = moment().format("YYYY-MM-DD");

    const insuranceTwoDays = moment(car.insuranceDate)
      .subtract(3, "days")
      .format("YYYY-MM-DD");
    const inspectTwoDays = moment(car.inspectionDay)
      .subtract(3, "days")
      .format("YYYY-MM-DD");

    const isTwoDaysInsurance = moment(today).isAfter(insuranceTwoDays);
    const isTwoDaysInspect = moment(today).isAfter(inspectTwoDays);

    const isSameInsurance = moment(today).isSame(car.insuranceDate);
    const isSameInspect = moment(today).isSame(car.inspectionDay);

    const isAfterInsurance = moment(today).isAfter(car.insuranceDate);
    const isAfterInspect = moment(today).isAfter(car.inspectionDay);

    let insuranceMsg = "保險即將到期";
    let inspectionMsg = "驗車時間即將到期";

    if (isSameInsurance || isAfterInsurance) insuranceMsg = "保險已到期";
    if (isSameInspect >= isAfterInspect) inspectionMsg = "驗車時間已到期";

    if (isTwoDaysInsurance) {
      messages.push(`${car.plateNum}: ${insuranceMsg}`);
    } else if (isTwoDaysInspect) {
      messages.push(`${car.plateNum}: ${inspectionMsg}`);
    }
  });

  console.log(messages);
  // 今天    驗車-3
  // console.log("today", moment().format("YYYY-MM-DD"));
  // console.log(moment("2022-09-21").isAfter("2022-09-20"));
  // console.log("same", moment("2022-09-21").isSame("2022-09-21"));

  // useEffect(() => {
  //   const getMessageToken = async () => {
  //     const response = await firebase.getMessageToken().catch((msg) => {
  //       console.log(msg);
  //     });
  //   };

  // const requestPermission = () => {
  //   console.log("Requesting permission...");
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === "granted") {
  //       console.log("Notification permission granted.");
  //       getMessageToken();
  //     }
  //   });
  // };

  // requestPermission();
  // }, []);
  useEffect(() => {
    firebase.onMessageFromFCM().then((payload) => {
      createMessage("remind", dispatch, payload.notification.title);
    });
  }, [dispatch]);

  return <div>TEST</div>;
};

export default Test;
