import { firestore } from "firebase-admin";

interface IAccount {
    id?: string;
    username: string;
    last_fetch_date: firestore.Timestamp;
    last_build_id: string;
}

export { IAccount };