import { library } from './library.js';
import './style.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTWpLdvaaE4ejNMeq5TS7K5ke5DzEBC2o",
  authDomain: "library-ac551.firebaseapp.com",
  projectId: "library-ac551",
  storageBucket: "library-ac551.appspot.com",
  messagingSenderId: "713271968882",
  appId: "1:713271968882:web:24f3c3817e274d26b5aeeb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

library();