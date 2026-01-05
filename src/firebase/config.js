import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB0rw_vlwzPDs9Td28_xaGp4xdOg1Amw8k",
    authDomain: "internal-issue-reporting-ead17.firebaseapp.com",
    projectId: "internal-issue-reporting-ead17",
    storageBucket: "internal-issue-reporting-ead17.firebasestorage.app",
    messagingSenderId: "495021351206",
    appId: "1:495021351206:web:ffad200afb3651ab9b61e7",
    measurementId: "G-NX5530VB9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
let authInstance;
try {
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (e) {
    authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
