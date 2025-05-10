'use client'

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZg5C1FP0Y5L_Yv8mb6FqB6LsQjGbLCXc",
  authDomain: "giapha-f91c2.firebaseapp.com",
  projectId: "giapha-f91c2",
  storageBucket: "giapha-f91c2.appspot.com",
  messagingSenderId: "537858600804",
  appId: "1:537858600804:web:7990fdde4c9eba5dc0d471",
  measurementId: "G-BSKTJYY3TT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export const storage = getStorage(app);