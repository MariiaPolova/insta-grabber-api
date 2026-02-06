import { IPost } from "../../../../database/interfaces/posts.js";
import postActions from '../../../../database/collections/posts.js';

async function getPostsInfo (accountId: string, userId: string): Promise<IPost[]> {
  const documents = await postActions.getAll({ account_username: accountId, user_id: userId });
  return documents;
}

export { getPostsInfo }