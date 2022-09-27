const functions = require("firebase-functions");
const https = require("https");
// const express = require("express");
// const app = express();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const { google } = require("googleapis");
const moment = require("moment");

const key = require("./motortrack-97569-firebase-adminsdk-gayv3-bbb0934f72.json");
initializeApp({
  credential: cert(key),
});

const db = getFirestore();
const PROJECT_ID = key.project_id;
const HOST = "fcm.googleapis.com";
const PATH = "/v1/projects/" + PROJECT_ID + "/messages:send";
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];

exports.scheduledFunction = functions.pubsub
  .schedule("every 1 hours from 08:00 to 09:00")
  .onRun(async (context) => {
    let users = [];

    const getUser = async () => {
      const querySnapshot = await db.collection("users").get();
      querySnapshot.forEach((doc) => {
        const user = doc.data();

        if (user.pushToken && user.continueRemind) {
          users.push({ userId: doc.id, token: user.pushToken });
        }
      });
    };

    const getCars = async (user) => {
      const querySnapshot = await db
        .collection("carsRecords")
        .where("ownerId", "==", user.userId)
        .get();
      querySnapshot.forEach((doc) => {
        const carMessage = inspectCarDate(doc.data());
        if (carMessage.length > 0) {
          carMessage.forEach((msg) => {
            user.token.forEach((token) => {
              sendFcmMessage(buildCommonMessage(msg, token));
            });
          });
        }
      });
    };
    try {
      await getUser();

      for (let i = 0; i < users.length; i++) {
        await getCars(users[i]);
      }
      users = [];
    } catch (e) {
      functions.logger.info(e);
    }
    return;
  });

exports.checkCarNotification = functions.https.onRequest(
  async (request, response) => {
    response.send("Hello from Firebase!");
    let users = [];

    const getUser = async () => {
      const querySnapshot = await db.collection("users").get();
      querySnapshot.forEach((doc) => {
        const user = doc.data();

        if (user.pushToken && user.continueRemind) {
          users.push({ userId: doc.id, token: user.pushToken });
        }
      });
    };

    const getCars = async (user) => {
      const querySnapshot = await db
        .collection("carsRecords")
        .where("ownerId", "==", user.userId)
        .get();
      querySnapshot.forEach((doc) => {
        const carMessage = inspectCarDate(doc.data());
        if (carMessage.length > 0) {
          carMessage.forEach((msg) => {
            user.token.forEach((token) => {
              sendFcmMessage(buildCommonMessage(msg, token));
            });
          });
        }
      });
    };
    try {
      await getUser();

      for (let i = 0; i < users.length; i++) {
        await getCars(users[i]);
      }
      users = [];
    } catch (e) {
      functions.logger.info(e);
    }
    return;
  }
);

exports.getUserNearby = functions.https.onRequest((request, response) => {
  console.log(request.query);
  cors(request, response, () => {
    axios(
      encodeURI(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${request.query.lat},${request.query.lng}&language=zh-TW&opennow=true&radius=1000&keyword=機車店&key=AIzaSyA4Xik7PsmlsZ4UPc154GTLZjxL4aVEBSM`
      )
    )
      .then((res) => {
        return JSON.parse(JSON.stringify(res.data));
      })
      .then((json) => response.json(json))
      .catch((error) => {
        console.log(error);
      });
  });
});

function inspectCarDate(car) {
  let messages = [];
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
  return messages;
}

function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      functions.logger.info(tokens.access_token);
      resolve(tokens.access_token);
    });
  });
}

function sendFcmMessage(fcmMessage) {
  getAccessToken().then(function (accessToken) {
    const options = {
      hostname: HOST,
      path: PATH,
      method: "POST",
      // [START use_access_token]
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      // [END use_access_token]
    };

    const request = https.request(options, function (resp) {
      resp.setEncoding("utf8");
      resp.on("data", function (data) {
        functions.logger.info(
          "Message sent to Firebase for delivery, response:"
        );
        functions.logger.info(data);
      });
    });

    request.on("error", function (err) {
      functions.logger.info("Unable to send message to Firebase");
      functions.logger.info(err);
    });

    request.write(JSON.stringify(fcmMessage));
    request.end();
  });
}

function buildCommonMessage(str, token) {
  return {
    message: {
      token: token,
      notification: {
        title: "貼心小提醒",
        body: str,
      },
    },
  };
}
