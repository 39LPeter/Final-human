import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {

  apiKey: "AIzaSyB7Wfn-alReTxIb4BB_Z14Z3CcC7cV3ino",

  authDomain: "humanrights-d797e.firebaseapp.com",

  projectId: "humanrights-d797e",

  storageBucket: "humanrights-d797e.firebasestorage.app",

  messagingSenderId: "636457258620",

  appId: "1:636457258620:web:422a61d82cc11332fcc3f9"

};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
