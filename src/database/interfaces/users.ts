import { firestore } from "firebase-admin";

interface IUser {
    id?: string;
    googleId: string; // Google OAuth user ID (sub)
    email: string;
    name?: string;
    accountId?: string; // Reference to the Instagram account in source_accounts collection
    created_at: firestore.Timestamp;
    updated_at: firestore.Timestamp;
}

export { IUser };
