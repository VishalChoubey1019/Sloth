import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAt-C82_iJ1EJVyeei6lCehfXTn9ZYGrs8",
    authDomain: "sloth-iitp.firebaseapp.com",
    projectId: "sloth-iitp",
    storageBucket: "sloth-iitp.appspot.com",
    messagingSenderId: "159795374011",
    appId: "1:159795374011:web:a530c4b467d2d2b243c69e",
    measurementId: "G-2MTMQH8X0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);