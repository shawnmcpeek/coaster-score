// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDf9Fp2a_84eHdeimmsAst4r6CkODMGQvU",
	authDomain: "coaster-score.firebaseapp.com",
	projectId: "coaster-score",
	storageBucket: "coaster-score.firebasestorage.app",
	messagingSenderId: "953948340409",
	appId: "1:953948340409:web:11707a08f997471de59b68",
	measurementId: "G-E6862R9FJK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);