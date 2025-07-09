
import admin from 'firebase-admin';
import { getApps, initializeApp, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace the following with your actual Firebase project configuration
// You can find this in your Firebase project settings.
const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getProjectIdFromServiceAccount(email: string | undefined): string | undefined {
    if (!email) {
        return undefined;
    }
    const match = email.match(/@(.+?)\.iam\.gserviceaccount\.com$/);
    return match?.[1];
}

// IMPORTANT: Set up your Firebase Admin SDK service account credentials
// This is used for server-side operations.
// Store these values securely in your environment variables.
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || getProjectIdFromServiceAccount(process.env.FIREBASE_CLIENT_EMAIL),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key needs to have newline characters correctly formatted.
  private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin SDK (for server-side code)
if (!admin.apps.length) {
    if (!serviceAccount.project_id) {
        throw new Error('Firebase Admin SDK Error: Could not determine "project_id". Please set FIREBASE_PROJECT_ID or ensure FIREBASE_CLIENT_EMAIL is a valid service account email.');
    }
    if (!serviceAccount.client_email) {
        throw new Error('Firebase Admin SDK Error: "client_email" is not set in your environment variables. Please set FIREBASE_CLIENT_EMAIL.');
    }
    if (!serviceAccount.private_key || serviceAccount.private_key === '\n') {
        throw new Error('Firebase Admin SDK Error: "private_key" is not set in your environment variables. Please set FIREBASE_PRIVATE_KEY.');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log("Firebase Admin SDK initialized.");
}

export const adminDb = admin.firestore();

// Initialize Firebase Client SDK (for client-side code)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
