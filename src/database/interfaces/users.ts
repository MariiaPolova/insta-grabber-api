import { firestore } from "firebase-admin";

interface IUser {
    id?: string;
    googleId: string; // Google OAuth user ID (sub)
    email: string;
    name?: string;
    created_at: firestore.Timestamp;
    updated_at?: firestore.Timestamp;
}

export { IUser };
