// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzYqBSNZq69XH54zhC8hqtpWzkXqM2iSI",
  authDomain: "inkandinsight-290c7.firebaseapp.com",
  projectId: "inkandinsight-290c7",
  storageBucket: "inkandinsight-290c7.firebasestorage.app",
  messagingSenderId: "521545219893",
  appId: "1:521545219893:web:26eb6d5fd994de9724567c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
