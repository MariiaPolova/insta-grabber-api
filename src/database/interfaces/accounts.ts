import { firestore } from "firebase-admin";

interface IAccount {
    id?: string;
    username: string;
    created_at: firestore.Timestamp;
    start_fetch_date?: firestore.Timestamp;
    end_fetch_date?: firestore.Timestamp;
    last_build_id?: string;
}

export { IAccount };