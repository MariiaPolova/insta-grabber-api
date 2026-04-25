import { firestore } from "firebase-admin";
import { IPost } from "./posts.js";

interface IList {
    id?: string;
    created_at: firestore.Timestamp;
    name: string;
    posts_ids?: string[]
}

interface IListWithPosts extends Omit<IList, 'posts_ids'> {
    posts_ids: IPost[];
 }

export { IList, IListWithPosts };