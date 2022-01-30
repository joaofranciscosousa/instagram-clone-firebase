import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDAfVJwrXI6shjCNCwPSyZ5dWJ6AzzRw-4",
    authDomain: "instagram-83455.firebaseapp.com",
    projectId: "instagram-83455",
    storageBucket: "instagram-83455.appspot.com",
    messagingSenderId: "773003383780",
    appId: "1:773003383780:web:9a651f84ca43a3d389adf1"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

export { db, auth, storage }