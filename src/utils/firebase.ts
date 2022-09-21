import { initializeApp } from "firebase/app";
import { userLogin } from "../types/userType";
import { carType } from "../types/carType";
import { partsType, partType, repairType, feeType } from "../types/recordType";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  doc,
  getDocs,
  getDoc,
  collection,
  setDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  DocumentData,
  arrayRemove,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDc2tuIBAOCWM1TcRwk8M5GMzBCDQAynKc",
  authDomain: "motortrack-97569.firebaseapp.com",
  projectId: "motortrack-97569",
  storageBucket: "motortrack-97569.appspot.com",
  messagingSenderId: "899173634521",
  appId: "1:899173634521:web:24142760923e9cddfe09c8",
};
const messageKey =
  "BMfPfF3tRqWFQxHBkwVfqa3-4xipfWPrTlq5Jo4CfQI-Z_egT-Cz16CCXKL_7njrfewWi5g_t5crdSfI2V06TwE";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export const messaging = getMessaging(app);
type dataType = {
  id: string;
  [index: string]: any;
};

const firebase = {
  async signUp(user: userLogin): Promise<string> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const userID = userCredential.user.uid;
          resolve(userID);
        })
        .catch((error) => {
          const errorMessage = error.message;

          reject(errorMessage);
        });
    });
  },
  async signIn(user: userLogin): Promise<string> {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const userID = userCredential.user.uid;
          resolve(userID);
        })
        .catch((error) => {
          const errorMessage = error.message;
          reject(errorMessage);
        });
    });
  },
  async logout(): Promise<string> {
    return new Promise((resolve) => {
      signOut(auth)
        .then(() => {
          resolve("Logout");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    });
  },
  async onAuth(): Promise<string> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          resolve(uid);
        } else {
          reject("SignedOut");
        }
      });
    });
  },
  async getDoc(url: string): Promise<DocumentData | undefined> {
    return new Promise(async (resolve) => {
      const docRef = doc(db, url);
      try {
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        resolve(data);
      } catch (e) {
        console.log(e);
      }
    });
  },
  async setDoc(url: string, data: object): Promise<string> {
    return new Promise(async (resolve) => {
      try {
        await setDoc(doc(db, url), data);
        resolve("Set doc already");
      } catch (e) {
        console.log(e);
      }
    });
  },
  async updateDoc(url: string, data: object): Promise<string> {
    return new Promise(async (resolve) => {
      const ref = doc(db, url);
      try {
        await updateDoc(ref, data);
        resolve("Update doc already");
      } catch (e) {
        console.log(e);
      }
    });
  },
  async delete(url: string): Promise<string> {
    return new Promise(async (resolve) => {
      try {
        await deleteDoc(doc(db, url));
        resolve("Delete it successfully");
      } catch (e) {
        console.log(e);
      }
    });
  },
  async setRecordDoc(url: string, data: dataType): Promise<dataType> {
    return new Promise(async (resolve) => {
      const newId = doc(collection(db, url));
      data.id = newId.id;
      data.records.forEach((part: partType) => (part.recordID = newId.id));
      try {
        resolve(data);
        await setDoc(newId, data);
      } catch (e) {
        console.log(e);
      }
    });
  },
  async setExpenseDoc(url: string, data: feeType): Promise<dataType> {
    return new Promise(async (resolve) => {
      const newId = doc(collection(db, url));
      data.id = newId.id;
      try {
        await setDoc(newId, data);
        resolve(data);
      } catch (e) {
        console.log(e);
      }
    });
  },

  async setMergeDoc(url: string, data: object): Promise<string> {
    return new Promise(async (resolve) => {
      try {
        await setDoc(doc(db, url), data, { merge: true });
        resolve("Set doc already");
      } catch (e) {
        console.log(e);
      }
    });
  },
  async deleteParts(url: string, data: partType): Promise<string> {
    return new Promise(async (resolve) => {
      const ref = doc(db, url);
      try {
        await updateDoc(ref, { records: arrayRemove(data) });
        resolve("Delete it successfully");
      } catch (e) {
        console.log(e);
      }
    });
  },
  async getAllRecords(id: string): Promise<{
    fee: feeType[];
    repair: repairType[];
    refuel: feeType[];
    parts: partsType;
  }> {
    return new Promise(async (resolve) => {
      const repairRecordsUrl = `/carsRecords/${id}/repairRecords`;
      const partsUrl = `/carsRecords/${id}/parts`;
      const feeRecordsUrl = `/carsRecords/${id}/feeRecords`;
      const refuelRecordsUrl = `/carsRecords/${id}/refuelRecords`;

      const recordObj = {
        fee: [] as feeType[],
        repair: [] as repairType[],
        refuel: [] as feeType[],
        parts: {} as partsType,
      };

      const repairRecordsSnapshot = getDocs(collection(db, repairRecordsUrl));
      const partsSnapshot = getDocs(collection(db, partsUrl));
      const refuelRecordsSnapshot = getDocs(collection(db, refuelRecordsUrl));
      const feeRecordsSnapshot = getDocs(collection(db, feeRecordsUrl));

      const promises = await Promise.all([
        repairRecordsSnapshot,
        partsSnapshot,
        refuelRecordsSnapshot,
        feeRecordsSnapshot,
      ]);
      promises.forEach((promise, index) => {
        if (promise.empty) return;
        if (index === 0) {
          promise.forEach((doc) => {
            recordObj.repair.push(doc.data() as repairType);
          });
        } else if (index === 1) {
          promise.forEach((doc) => {
            const partObj = doc.data();
            recordObj.parts[doc.id] = partObj.records;
          });
        } else if (index === 2) {
          promise.forEach((doc) => {
            recordObj.refuel.push(doc.data() as feeType);
          });
        } else if (index === 3) {
          promise.forEach((doc) => {
            recordObj.fee.push(doc.data() as feeType);
          });
        }
      });

      resolve(recordObj);
    });
  },

  async setCarDoc(data: carType): Promise<carType> {
    return new Promise(async (resolve) => {
      const newCrtId = doc(collection(db, "carsRecords"));
      data.id = newCrtId.id;
      try {
        resolve(data);
        await setDoc(newCrtId, data);
      } catch (e) {
        console.log(e);
      }
    });
  },
  async getCars(id: string): Promise<carType[]> {
    return new Promise(async (resolve) => {
      const q = query(
        collection(db, "carsRecords"),
        where("ownerId", "==", id)
      );
      const querySnapshot = await getDocs(q);
      const carArr: carType[] = [];
      querySnapshot.forEach((doc) => {
        carArr.push(doc.data() as carType);
      });
      resolve(carArr);
    });
  },
  async uploadImage(url: string, file: File): Promise<string> {
    return new Promise((resolve) => {
      const storageRef = ref(storage, url);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("upload");
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  },
  async onOffline(): Promise<string> {
    return new Promise((resolve, reject) => {
      enableIndexedDbPersistence(db)
        .then((res) => {
          resolve("success");
        })
        .catch((err) => {
          if (err.code === "failed-precondition") {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
            reject("Multiple tabs open");
          } else if (err.code === "unimplemented") {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
            reject("The current browser does not support");
          }
        });
    });
  },
  async getMessageToken() {
    return new Promise((resolve) => {
      getToken(messaging, { vapidKey: messageKey })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            console.log(currentToken);
            resolve(currentToken);
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
            // ...
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
          // ...
        });
    });
  },
  async onMessageFromFCM() {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        resolve(payload);
        const notificationTitle = "Message Title";
        const notificationOptions = {
          body: "Message body.",
        };
        new Notification(notificationTitle, notificationOptions);
      });
    });
  },
};
export default firebase;
