import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';

// Emulator toggles
export const FUNCTIONS_EMULATOR_ENABLED =
  typeof localStorage !== 'undefined' && localStorage.getItem('functions-emulator-enabled') !== 'false';
export const AUTH_EMULATOR_ENABLED =
  typeof localStorage !== 'undefined' && localStorage.getItem('auth-emulator-enabled') === 'true';
export const FIRESTORE_EMULATOR_ENABLED =
  typeof localStorage !== 'undefined' && localStorage.getItem('firestore-emulator-enabled') === 'true';

// Emulator ports
export const FIRESTORE_EMULATOR_PORT = 8080;
export const AUTH_EMULATOR_PORT = 9099;

// === Emulator setup ===
const siteEnvironment = __ENVIRONMENT__;

export const hasFirebaseConfig = typeof firebaseConfig !== 'undefined';
export const app: FirebaseApp | undefined = hasFirebaseConfig ? initializeApp(firebaseConfig) : undefined;
export const firestore: Firestore | undefined = app ? getFirestore(app) : undefined;
if (firestore && FIRESTORE_EMULATOR_ENABLED && siteEnvironment === 'development') {
  connectFirestoreEmulator(firestore, 'localhost', FIRESTORE_EMULATOR_PORT);
}

export const auth: Auth | undefined = app ? getAuth(app) : undefined;
if (auth && AUTH_EMULATOR_ENABLED && siteEnvironment === 'development') {
  connectAuthEmulator(auth, `http://localhost:${AUTH_EMULATOR_PORT}`);
}
