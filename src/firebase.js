// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpEh9J19Pv3IAzouLag8NpwizlViLhWRc",
  authDomain: "smart-tracker-67078.firebaseapp.com",
  projectId: "smart-tracker-67078",
  storageBucket: "smart-tracker-67078.firebasestorage.app",
  messagingSenderId: "577535240285",
  appId: "1:577535240285:web:4bbe943af15a5372c705b4",
  measurementId: "G-3Q86ZM65XJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 3. Initialize services and EXPORT them
export const db = getFirestore(app);
export const storage = getStorage(app);
