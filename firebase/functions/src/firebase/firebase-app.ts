import { initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

// The Firebase Admin SDK to access Cloud Firestore using Application Default Credentials.
const app = initializeApp();
export const firestore: Firestore = getFirestore(app);
