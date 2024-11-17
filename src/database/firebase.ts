import admin from "firebase-admin";
// import serviceAccount from './grabber-firebase-adminsdk.private.json' assert { type: 'json' };
import serviceAccount from './grabber-firebase-adminsdk.private.json';


admin.initializeApp({
    credential: admin.credential.cert( 
        serviceAccount as admin.ServiceAccount
        // privateKey: process.env.FIREBASE_PRIVATE_KEY, 
        // projectId: process.env.FIREBASE_PROJECT_ID, 
        // clientEmail: process.env.FIREBASE_CLIENT_EMAIL }
    )
});
const db = admin.firestore();

export default db;