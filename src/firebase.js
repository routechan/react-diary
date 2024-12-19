import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbyfy34y8MZ8jSFcmJPYX94h5xtaIc6aQ",
  authDomain: "diary-app-27b21.firebaseapp.com",
  projectId: "diary-app-27b21",
  storageBucket: "diary-app-27b21.firebasestorage.app",
  messagingSenderId: "239001174645",
  appId: "1:239001174645:web:0e6ad17504db94cef36e3c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
