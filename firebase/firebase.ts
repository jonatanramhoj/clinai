import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCx_RxKhzpVguGZ4Qdz9BI_4vzM_ytTXk0",
  authDomain: "clinai-f94ab.firebaseapp.com",
  projectId: "clinai-f94ab",
  storageBucket: "clinai-f94ab.firebasestorage.app",
  messagingSenderId: "638171962087",
  appId: "1:638171962087:web:727a9bcbaf067a7e4ea042",
  measurementId: "G-BEFWCTB14C",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
