import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//배포용
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_KEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyC1Z5Sl0P_WuafG-4Fgx08TeKD1KzSAjFU",
  authDomain: "tacku-table.firebaseapp.com",
  projectId: "tacku-table",
  storageBucket: "tacku-table.appspot.com",
  messagingSenderId: "470777376989",
  appId: "1:470777376989:web:ed93c811f68a6dd2ee2b34",
};

let firebase;
if (!getApps().length) firebase = initializeApp(firebaseConfig);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authService = getAuth(app);
export const dbService = getFirestore(app);
export const storage = getStorage(app);