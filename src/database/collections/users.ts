import { collections } from "../constants.js";
import { IUser } from "../interfaces/users.js";
import { getCollectionLayer } from "./common.js";
import { db } from "../../firebase.js";

const collectionName = collections.users;

const layer = getCollectionLayer<IUser>(collectionName);

// Auth-specific method for user lookups (no user_id requirement)
async function getAuthOne(filter: { key?: string; value?: string; id?: string }): Promise<IUser | null> {
  const { id, key, value } = filter;
  const docRef = db.collection(collectionName);

  if (id) {
    const doc = await docRef.doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() } as IUser;
    }
    return null;
  } else if (key && value) {
    const query = docRef.where(key, '==', value);
    const snapshot = await query.get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IUser;
  }
  return null;
}

export default { ...layer, getAuthOne };