// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmWvyVuUY0sUD9VgrYyeEdtY_RpRZxYcY",
  authDomain: "fir-course-7515b.firebaseapp.com",
  projectId: "fir-course-7515b",
  storageBucket: "fir-course-7515b.appspot.com",
  messagingSenderId: "92385810706",
  appId: "1:92385810706:web:bc5b0cbfa44607a14b3bcb",
  measurementId: "G-TBHJYG8WRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const googleAuthProvider = new  GoogleAuthProvider(app)
export const db = getFirestore(app)