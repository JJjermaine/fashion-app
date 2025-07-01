import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-5YaqLnmdxwInBDFrsVfAb97ztXp7al4",
  authDomain: "fitcheck-9a904.firebaseapp.com",
  projectId: "fitcheck-9a904",
  storageBucket: "fitcheck-9a904.firebasestorage.app",
  messagingSenderId: "922432459401",
  appId: "1:922432459401:web:0e1c6abacbd76fb1b56c58",
  measurementId: "G-21P7PJTS5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;