// src/lib/stores/auth.js
import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { browser } from '$app/environment';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";

const db = getFirestore();
export const user = writable(null);
export const showAuthModal = writable(false);

// Only set up auth listener in the browser
if (browser && auth) {
    auth.onAuthStateChanged(async (userData) => {
        user.set(userData);
        if (userData) {
            const userDoc = await getDoc(doc(db, 'users', userData.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', userData.uid), {
                    email: userData.email,
                    userName: '',
                    coasterScore: 0,
                    selectedCoasters: []
                });
            }
        }
    });
}

export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showAuthModal.set(false);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email,
            userName: '',
            coasterScore: 0,
            selectedCoasters: []
        });
        showAuthModal.set(false);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}