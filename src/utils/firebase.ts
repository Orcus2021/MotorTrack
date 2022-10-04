import { initializeApp } from "firebase/app";
import { userLogin } from "../types/userType";
import { carType } from "../types/carType";
import logoIcon from "../assets/icon/logo192.png";
import { partsType, partType, repairType, feeType } from "../types/recordType";
import { myMapContentType, userType } from "../types/mapType";
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
import {
  getDatabase,
  ref as relRef,
  set,
  child,
  push,
  update,
  onValue,
  get,
  off,
} from "firebase/database";

import swDev from "../swDev";

const firebaseConfig = {
  apiKey: "AIzaSyDc2tuIBAOCWM1TcRwk8M5GMzBCDQAynKc",
  authDomain: "motortrack-97569.firebaseapp.com",
  databaseURL:
    "https://motortrack-97569-default-rtdb.asia-southeast1.firebasedatabase.app",
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
export const database = getDatabase(app);
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
        // FIXME
        resolve("Update doc already");
        await updateDoc(ref, data);
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
        resolve(data);
        await setDoc(newId, data);
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
            reject("Multiple tabs open");
          } else if (err.code === "unimplemented") {
            reject("The current browser does not support");
          }
        });
    });
  },
  async getMessageToken() {
    return new Promise(async (resolve, reject) => {
      try {
        const sw = await swDev();
        let token = await getToken(messaging, {
          vapidKey: messageKey,
          serviceWorkerRegistration: sw,
        });
        if (token) {
          resolve(token);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
  async onMessageFromFCM() {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        if (payload.notification) {
          const notificationTitle = payload.notification.title;
          const notificationOptions = {
            body: payload.notification.body,
            icon: logoIcon,
          };
          new Notification(notificationTitle as string, notificationOptions);
          resolve(payload);
        }
      });
    });
  },
  async setMapDoc(data: myMapContentType): Promise<myMapContentType> {
    return new Promise(async (resolve) => {
      const newMapId = doc(collection(db, "maps"));
      data.id = newMapId.id;
      try {
        await setDoc(newMapId, data);
        resolve(data);
      } catch (e) {
        console.log(e);
      }
    });
  },
  async getMapDoc(id: string): Promise<myMapContentType[]> {
    return new Promise(async (resolve, reject) => {
      const q = query(collection(db, "maps"), where("ownerID", "==", id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot && !querySnapshot.empty) {
        let myMaps = [] as myMapContentType[];
        querySnapshot.forEach((doc) => {
          myMaps.push(doc.data() as myMapContentType);
        });
        resolve(myMaps);
      } else {
        reject("error");
      }
    });
  },
  async setUserMapRoom(id: string, data: userType[]): Promise<string> {
    return new Promise(async (resolve) => {
      console.log(data);
      set(relRef(database, "room/" + id + "/users"), data);
      resolve("submit");
    });
  },
  async updateUserMapRoom(url: string, data: object): Promise<string> {
    return new Promise(async (resolve) => {
      update(relRef(database, url), data);
      resolve("update");
    });
  },
  async getUserMapRoom(id: string): Promise<userType[]> {
    return new Promise(async (resolve) => {
      const dbRef = relRef(database);
      get(child(dbRef, "room/" + id + "/users"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },
  async listenUserMapRoom(id: string): Promise<userType[]> {
    return new Promise(async (resolve) => {
      const usersRef = relRef(database, "room/" + id + "/users");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();

        resolve(data);
      });
    });
  },
  async getIdMapRoom(id: string, data: userType): Promise<string> {
    return new Promise(async (resolve) => {
      const newKey = push(child(relRef(database), "room/" + id + "/users")).key;

      update(relRef(database), data);
      resolve(newKey as string);
    });
  },
  async offUserMapRoom(url: string): Promise<userType[]> {
    return new Promise(async (resolve) => {
      const usersRef = relRef(database, url);
      off(usersRef);
    });
  },
};
export default firebase;
