import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "coaster-score.firebaseapp.com",
    projectId: "coaster-score",
    storageBucket: "coaster-score.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 