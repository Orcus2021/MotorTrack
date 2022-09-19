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

const firebaseConfig = {
  apiKey: "AIzaSyDc2tuIBAOCWM1TcRwk8M5GMzBCDQAynKc",
  authDomain: "motortrack-97569.firebaseapp.com",
  projectId: "motortrack-97569",
  storageBucket: "motortrack-97569.appspot.com",
  messagingSenderId: "899173634521",
  appId: "1:899173634521:web:24142760923e9cddfe09c8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
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
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      resolve(data);
    });
  },
  async setDoc(url: string, data: object): Promise<string> {
    return new Promise(async (resolve) => {
      await setDoc(doc(db, url), data);
      resolve("Set doc already");
    });
  },
  async updateDoc(url: string, data: object): Promise<string> {
    return new Promise(async (resolve) => {
      const ref = doc(db, url);
      await updateDoc(ref, data);
      resolve("Update doc already");
    });
  },
  async delete(url: string): Promise<string> {
    return new Promise(async (resolve) => {
      await deleteDoc(doc(db, url));
      resolve("Delete it successfully");
    });
  },
  async setRecordDoc(url: string, data: dataType): Promise<dataType> {
    return new Promise(async (resolve) => {
      const newId = doc(collection(db, url));
      data.id = newId.id;
      data.records.forEach((part: partType) => (part.recordID = newId.id));
      await setDoc(newId, data);
      resolve(data);
    });
  },
  async setExpenseDoc(url: string, data: feeType): Promise<dataType> {
    return new Promise(async (resolve) => {
      const newId = doc(collection(db, url));
      data.id = newId.id;
      await setDoc(newId, data);
      resolve(data);
    });
  },

  async setMergeDoc(url: string, data: object): Promise<string> {
    return new Promise(async (resolve) => {
      await setDoc(doc(db, url), data, { merge: true });
      resolve("Set doc already");
    });
  },
  async deleteParts(url: string, data: partType): Promise<string> {
    return new Promise(async (resolve) => {
      const ref = doc(db, url);
      await updateDoc(ref, { records: arrayRemove(data) });
      resolve("Delete it successfully");
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

      await setDoc(newCrtId, data);
      resolve(data);
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
  async uploadImage(url: string, file: File) {
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
};
export default firebase;
