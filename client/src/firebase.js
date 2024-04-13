// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mridul-s-blog.firebaseapp.com",
  projectId: "mridul-s-blog",
  storageBucket: "mridul-s-blog.appspot.com",
  messagingSenderId: "255805640510",
  appId: "1:255805640510:web:18139e24dde0675221266f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

