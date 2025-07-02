// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-f8949.firebaseapp.com",
  projectId: "mern-blog-f8949",
  storageBucket: "mern-blog-f8949.appspot.com",
  messagingSenderId: "210518233007",
  appId: "1:210518233007:web:af2320e024359e7159e95a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);