
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

let adminDb: admin.firestore.Firestore;
let isAdminSdkInitialized = false;

// Initialize Firebase Admin SDK (for server-side code)
// This is wrapped in a try/catch to prevent crashing during build/dev if env vars are not set.
try {
    const serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || getProjectIdFromServiceAccount(process.env.FIREBASE_CLIENT_EMAIL),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };
    
    const hasCredentials = serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key && serviceAccount.private_key !== '\n';

    if (admin.apps.length === 0) {
        if (hasCredentials) {
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            });
            console.log("Firebase Admin SDK initialized.");
            isAdminSdkInitialized = true;
        } else {
             throw new Error("Missing Firebase Admin credentials.");
        }
    } else {
        isAdminSdkInitialized = true;
    }
    adminDb = admin.firestore();

} catch (error) {
    isAdminSdkInitialized = false;
    console.warn("****************************************************************************************************");
    console.warn("********** FIREBASE ADMIN SDK INITIALIZATION FAILED **************************************************");
    console.warn("********** Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY ***********");
    console.warn("********** in a .env file. Any server-side data fetching will fail. ********************************");
    console.warn("****************************************************************************************************");

    adminDb = new Proxy({}, {
        get(target, prop) {
            const err = `Firebase Admin SDK not initialized. Cannot access 'adminDb.${String(prop)}'. Please check your server logs for configuration instructions.`;
            throw new Error(err);
        }
    }) as admin.firestore.Firestore;
}

// Initialize Firebase Client SDK (for client-side code)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { adminDb, db, isAdminSdkInitialized };
