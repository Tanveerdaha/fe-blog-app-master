import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCt1b7g4V8AmtmKUscg8OJWYbLhg6KO210",
  authDomain: "tech-blog-35852.firebaseapp.com",
  projectId: "tech-blog-35852",
  storageBucket: "tech-blog-35852.firebasestorage.app",
  messagingSenderId: "946039036966",
  appId: "1:946039036966:web:188489fb7d83a2ab511ae7",
  measurementId: "G-H3756YGPV5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);