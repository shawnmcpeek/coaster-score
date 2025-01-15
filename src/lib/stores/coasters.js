// src/lib/stores/coasters.js
import { writable } from 'svelte/store';
import { user } from './Auth.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { isBrowser } from 'esm-env';

export const selectedCoasters = writable(new Set());

// Only try to access localStorage in the browser
if (isBrowser) {
    const savedLocal = localStorage.getItem('selectedCoasters');
    if (savedLocal) {
        selectedCoasters.set(new Set(JSON.parse(savedLocal)));
    }
}

// Subscribe to auth changes
user.subscribe(async (userData) => {
    if (userData) {
        // Load and merge user's saved coasters with local
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', userData.uid));
        if (userDoc.exists() && userDoc.data().selectedCoasters) {
            // Merge stored selections with any local selections
            const storedSelections = new Set(userDoc.data().selectedCoasters);
            selectedCoasters.update(local => new Set([...local, ...storedSelections]));
        }
    }
    // Don't clear selections on logout - let them stay local
});