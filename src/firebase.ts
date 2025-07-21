import admin from "firebase-admin";
import serviceAccount from './grabber-firebase-adminsdk.private.json';

admin.initializeApp({
    credential: admin.credential.cert( 
        serviceAccount as admin.ServiceAccount
    ),
    storageBucket: process.env.STORAGE_BUCKET
});
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const storage = admin.storage();

export { db, storage };