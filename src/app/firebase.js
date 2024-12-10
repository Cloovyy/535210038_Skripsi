// src/app/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Inisialisasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTnUeTYMgxBzsI-_o0IXi0HFG7foCJWNE",
  authDomain: "dbnba-b12f8.firebaseapp.com",
  projectId: "dbnba-b12f8",
  storageBucket: "bnba-b12f8.appspot.com",
  messagingSenderId: "739654401920",
  appId: "1:739654401920:web:b787c96dcb654ad5ef4b65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fungsi untuk registrasi pengguna
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Simpan email ke Firestore
    await addDoc(collection(db, 'users'), {
      email: email,
      uid: userCredential.user.uid
    });
    console.log("User registered:", userCredential.user);
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

// Fungsi untuk mengambil semua pengguna
export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

// Fungsi untuk login pengguna
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Memantau status pengguna
export const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
      callback(user);
    } else {
      console.log("No user is signed in.");
      callback(null);
    }
  });
};
