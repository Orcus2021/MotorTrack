import React, { useState, useEffect, useRef } from "react";
import MyMap from "./Map";
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
  const [count, setCount] = useState(0);
  const [distance, setDistance] = useState(0);
  const timerID = useRef("");
  const timerGPS = useRef("");
  const gpsID = useRef("");
  const LonAndLat = useRef({
    latBefore: "",
    lonBefore: "",
  });

  function calcDistance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") {
        dist = dist * 1.609344;
      }
      if (unit === "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }
  function successHandler(position) {
    const { latitude, longitude } = position;
    if (LonAndLat.current?.latBefore && LonAndLat.current?.lonBefore) {
      const dist = calcDistance(
        LonAndLat.current.latBefore,
        LonAndLat.current.lonBefore,
        latitude,
        longitude,
        "K"
      );
      setDistance((pre) => pre + dist);
    }
    LonAndLat.current.latBefore = latitude;
    LonAndLat.current.lonBefore = longitude;
  }

  function errorHandler(err) {
    console.log(err);
  }

  useEffect(() => {
    // if (navigator.geolocation) {
    //   console.log("Geolocation is supported!");
    //   const options = {
    //     enableHighAccuracy: false,
    //     timeout: 5000,
    //     maximumAge: 0,
    //   };
    //   function success(pos) {
    //     const crd = pos.coords;
    //     console.log("Your current position is:");
    //     console.log(`Latitude : ${crd.latitude}`);
    //     console.log(`Longitude: ${crd.longitude}`);
    //     console.log(`More or less ${crd.accuracy} meters.`);
    //   }
    //   function error(err) {
    //     console.warn(`ERROR(${err.code}): ${err.message}`);
    //   }
    //   navigator.geolocation.getCurrentPosition(success, error, options);
    // } else {
    //   console.log("Geolocation is not supported for this Browser/OS.");
    // }
    // watchPosition 執行後會回傳一個獨一的 ID
  }, []);
  const startHandler = () => {
    timerID.current = setInterval(() => {
      setCount((pre) => pre + 1);
    }, 1000);
  };
  const stopHandler = () => {
    clearInterval(timerID.current);
    setCount(0);
  };
  const startGPS = () => {
    // if (navigator.geolocation) {
    //   gpsID.current = navigator.geolocation.watchPosition(
    //     successHandler,
    //     errorHandler
    //   );
    // }
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(pos) {
        const crd = pos.coords;
        console.log(crd);
        successHandler(crd);
        // console.log("Your current position is:");
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);
        // console.log(`More or less ${crd.accuracy} meters.`);
      }
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      timerGPS.current = setInterval(() => {
        console.log("test");
        navigator.geolocation.getCurrentPosition(success, error, options);
      }, 15000);
    } else {
      console.log("Geolocation is not supported for this Browser/OS.");
    }
  };
  const stopGPS = () => {
    // navigator.geolocation.clearWatch(gpsID.current);
    clearInterval(timerGPS.current);
    setDistance(0);
  };

  return (
    <>
      <div>
        <p>{count}</p>
        <button onClick={startHandler}>Start</button>
        <button onClick={stopHandler}>Stop</button>
        <button onClick={startGPS}>StartGPS</button>
        <button onClick={stopGPS}>StopGPS</button>
        <button>Get Map</button>
        <p>GPS:{distance}</p>
      </div>
      <MyMap />
    </>
  );
};

export default Test;
