import { firestore } from "firebase-admin";

interface IList {
    created_at: firestore.Timestamp;
    name: string;
    posts_ids?: string[]
}

export { IList };