import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAaNORqDEFQzeShSIkagUHdXv5yKUXyrbA",
  authDomain: "cameo-67dc1.firebaseapp.com",
  projectId: "cameo-67dc1",
  storageBucket: "cameo-67dc1.appspot.com",
  messagingSenderId: "115322419429",
  appId: "1:115322419429:web:11e3ee42f298e863997c0c",
  measurementId: "G-ZH2ZPY8V8D",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage, doc, getDoc, updateDoc };
