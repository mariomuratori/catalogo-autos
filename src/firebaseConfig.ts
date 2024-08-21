// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-EuojHWXkB9Avzh1mBCPwOZ3NvCJaISs",
  authDomain: "catalogoautos-993b2.firebaseapp.com",
  projectId: "catalogoautos-993b2",
  storageBucket: "catalogoautos-993b2.appspot.com",
  messagingSenderId: "243553506244",
  appId: "1:243553506244:web:2a570026ab824621d0ca91",
  measurementId: "G-QWMB3T2FEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error("Persistence failed: Multiple tabs open.");
  } else if (err.code === 'unimplemented') {
    console.error("Persistence is not available in this browser.");
  }
});

// Export db and auth to use them in other parts of your application
export { db, auth };
