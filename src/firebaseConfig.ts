import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA-iktThVLiXS354hsw3AhuF-BHIuBtBf8",
  authDomain: "gr-student-hub.firebaseapp.com",
  projectId: "gr-student-hub",
  storageBucket: "gr-student-hub.firebasestorage.app",
  messagingSenderId: "1036110131987",
  appId: "1:1036110131987:web:949c2b3a7966cc4ae560e6",
  measurementId: "G-3BGS60PKVT",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
