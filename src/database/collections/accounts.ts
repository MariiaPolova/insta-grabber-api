import { collections } from "../constants.js";
import { IAccount } from "../interfaces/accounts.js";
import { getCollectionLayer } from "./common.js";
import { db } from "../../firebase.js";
import { getDocument } from "../database.service.js";

const collectionName = collections.accounts;

const layer = getCollectionLayer<IAccount>(collectionName);

async function removeAccountAndPosts(username: string) {
  try {
    const accountToRemove = await getDocument<IAccount>(collections.accounts, { key: 'username', value: username });

    if(!accountToRemove?.id) {
      throw new Error(`Account with username ${username} not found`);
    }

    await db.runTransaction(async (transaction) => {
      // Get all posts for this account
      const postsSnapshot = await transaction.get(
        db.collection(collections.posts).where('account_username', '==', username)
      );
      
      const postIds = postsSnapshot.docs.map(doc => doc.id);
      
      // Remove posts from all lists
      if (postIds.length > 0) {
        const listsSnapshot = await transaction.get(db.collection(collections.lists));
        listsSnapshot.docs.forEach((listDoc) => {
          const listData = listDoc.data();
          const updatedPostIds = (listData.posts || []).filter((id: string) => !postIds.includes(id));
          transaction.update(listDoc.ref, { posts: updatedPostIds });
        });
      }
      
      // Delete all posts in the transaction
      postsSnapshot.docs.forEach((doc) => {
        transaction.delete(doc.ref);
      });
      
      // Delete the account in the transaction
      transaction.delete(db.collection(collections.accounts).doc(accountToRemove.id!));
    });
    
    console.log(`Account ${username} and associated posts removed successfully`);
    return true;
  } catch (error) {
    console.error("Error removing account and posts:", error);
    return false;
  }
}

export default layer;
export { removeAccountAndPosts };
