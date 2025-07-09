
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

let adminDb: admin.firestore.Firestore;
let isAdminSdkInitialized = false;

// Prepare service account credentials from environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

// Check if all necessary admin credentials are provided
if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        // The cert object requires snake_case keys
        credential: admin.credential.cert({
          project_id: serviceAccount.projectId,
          client_email: serviceAccount.clientEmail,
          private_key: serviceAccount.privateKey,
        }),
      });
      console.log("Firebase Admin SDK initialized successfully.");
    }
    adminDb = admin.firestore();
    isAdminSdkInitialized = true;
  } catch (error: any) {
    console.error("!!! Firebase Admin SDK initialization failed:", error.message);
    isAdminSdkInitialized = false;
  }
} else {
  console.warn("**********************************************************************");
  console.warn("*** Firebase Admin credentials not set in environment. ***************");
  console.warn("*** Server-side database operations will be disabled. ****************");
  console.warn("*** Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and *******");
  console.warn("*** FIREBASE_PRIVATE_KEY in your .env file. **************************");
  console.warn("**********************************************************************");
}

// Initialize Firebase Client SDK (for client-side code)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { adminDb, db, isAdminSdkInitialized };
