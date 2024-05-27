// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-KvURdAdtYV08YZZqRV7NZrs5q6TMNbQ",
  authDomain: "anime-calendar-43329.firebaseapp.com",
  projectId: "anime-calendar-43329",
  storageBucket: "anime-calendar-43329.appspot.com",
  messagingSenderId: "955240602889",
  appId: "1:955240602889:web:440e7028f73ae5e58987d8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app);
