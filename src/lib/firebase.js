// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { browser } from '$app/environment';

const firebaseConfig = {
	apiKey: "AIzaSyDf9Fp2a_84eHdeimmsAst4r6CkODMGQvU",
	authDomain: "coaster-score.firebaseapp.com",
	projectId: "coaster-score",
	storageBucket: "coaster-score.firebasestorage.app",
	messagingSenderId: "953948340409",
	appId: "1:953948340409:web:11707a08f997471de59b68",
	measurementId: "G-E6862R9FJK"
};

// Only initialize Firebase in the browser, not during SSR
export const app = browser ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]) : null;
export const auth = browser ? getAuth(app) : null;
export const db = browser ? getFirestore(app) : null;