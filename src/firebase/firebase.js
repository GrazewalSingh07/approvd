import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxaGUt986pcZPq8XxtsunkVOk5uWnFl8s",
    authDomain: "approvd-41bd1.firebaseapp.com",
    projectId: "approvd-41bd1",
    storageBucket: "approvd-41bd1.appspot.com",
    messagingSenderId: "814370530563",
    appId: "1:814370530563:web:616bfd52c2db3c220c3536",
    measurementId: "G-2SFW4DH351"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db =getFirestore(app)



export { app, auth ,db};