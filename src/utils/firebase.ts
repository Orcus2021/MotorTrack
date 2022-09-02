import { initializeApp } from "firebase/app";
import { userLogin } from "../types/userType";
import { carType } from "../types/carType";
import { partsType, partType, repairType, feeType } from "../types/recordType";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
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
          // const errorCode = error.code;
          const errorMessage = error.message;
          // console.log(errorCode, errorMessage);
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
  async setMergeDoc(url: string, data: object): Promise<string> {
    return new Promise(async (resolve) => {
      await setDoc(doc(db, url), data, { merge: true });
      resolve("Set doc already");
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
      const refuelRecordsUrl = `/carsRecords/${id}/ refuelRecords`;
      const recordObj = {
        fee: [] as feeType[],
        repair: [] as repairType[],
        refuel: [] as feeType[],
        parts: {} as partsType,
      };
      const repairRecordsSnapshot = await getDocs(
        collection(db, repairRecordsUrl)
      );
      const partsSnapshot = await getDocs(collection(db, partsUrl));
      const feeRecordsSnapshot = await getDocs(collection(db, feeRecordsUrl));
      const refuelRecordsSnapshot = await getDocs(
        collection(db, refuelRecordsUrl)
      );

      repairRecordsSnapshot.forEach((doc) => {
        recordObj.repair.push(doc.data() as repairType);
      });

      feeRecordsSnapshot.forEach((doc) => {
        recordObj.fee.push(doc.data() as feeType);
      });

      refuelRecordsSnapshot.forEach((doc) => {
        recordObj.refuel.push(doc.data() as feeType);
      });
      partsSnapshot.forEach((doc) => {
        const partObj = doc.data();
        recordObj.parts[doc.id] = partObj.records;
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
};
export default firebase;
