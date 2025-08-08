// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfUNu-QGVS_vACR6Am5p_7Gr9o4BwZt7w",
  authDomain: "lease-home.firebaseapp.com",
  projectId: "lease-home",
  storageBucket: "lease-home.firebasestorage.app",
  messagingSenderId: "20380256042",
  appId: "1:20380256042:web:038aea2b8c455ec05e8053",
  measurementId: "G-JWW80GVS5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); 
export default app;   