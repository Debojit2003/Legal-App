// firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvVT-0YZaYkL3skOqml3zVvorYP5i_U2A",
  authDomain: "trialtech-86b78.firebaseapp.com",
  projectId: "trialtech-86b78",
  storageBucket: "trialtech-86b78.appspot.com",
  messagingSenderId: "826061427123",
  appId: "1:826061427123:web:1919a552ff172f9e27fbc6",
  measurementId: "G-VCE74RB12K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);