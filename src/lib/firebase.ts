import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

// Firebase configuration
// These should be set via environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your-api-key-here') {
  console.warn(
    '⚠️ Firebase configuration is missing or incomplete. Please set VITE_FIREBASE_* environment variables in your .env file.\n' +
      'See .env.example for the required variables.\n' +
      'Get your Firebase config from: https://console.firebase.google.com/ > Project Settings > Your apps',
  );
}

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw new Error(
      'Firebase initialization failed. Please check your .env file and ensure all VITE_FIREBASE_* variables are set correctly.',
    );
  }
} else {
  app = getApps()[0];
}

// Initialize Auth
export const auth: Auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default app;
