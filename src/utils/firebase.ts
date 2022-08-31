import { initializeApp } from "firebase/app";
import { userLogin } from "../types/userType";
import { carType } from "../types/carType";
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
  async getDoc(url: string) {
    return new Promise(async (resolve) => {
      const docRef = doc(db, url);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      resolve(data);
    });
  },
  async setDoc(url: string, data: object) {
    return new Promise(async (resolve) => {
      await setDoc(doc(db, url), data);
      resolve("Set doc already");
    });
  },
  async updateDoc(url: string, data: object) {
    return new Promise(async (resolve) => {
      const ref = doc(db, url);
      await updateDoc(ref, data);
      resolve("Update doc already");
    });
  },
  async setCarDoc(data: carType) {
    return new Promise(async (resolve) => {
      const newCrtId = doc(collection(db, "carsRecords"));
      data.id = newCrtId.id;
      console.log(data);
      await setDoc(newCrtId, data);
      resolve(data);
    });
  },
  async getCars(id: string) {
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
  async delete(url: string) {
    return new Promise(async (resolve) => {
      await deleteDoc(doc(db, url));
      resolve("Delete it successfully");
    });
  },
};
export default firebase;
