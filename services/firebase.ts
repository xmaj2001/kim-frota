import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtbPFZVjc8ecv6N5qy4C6ZR6htgX5d4qw",
  authDomain: "kimfrota.firebaseapp.com",
  projectId: "kimfrota",
  storageBucket: "kimfrota.firebasestorage.app",
  messagingSenderId: "58246272263",
  appId: "1:58246272263:android:11c4dbc8ec056f4c13a1a2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
