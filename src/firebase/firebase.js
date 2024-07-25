import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: "task-four-f96b3.firebaseapp.com",
  projectId: "task-four-f96b3",
  storageBucket: "task-four-f96b3.appspot.com",
  messagingSenderId: "431918538566",
  appId: "1:431918538566:web:1ed2245fb8aa1513ec8f47",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };

export default app;
