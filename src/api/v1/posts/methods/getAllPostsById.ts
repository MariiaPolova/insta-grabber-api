import { IPost } from "../../../../database/interfaces/posts.js";
import postActions from '../../../../database/collections/posts.js';

async function getPostsInfo (userId: string, accountId: string): Promise<IPost[]> {
  const documents = await postActions.getAll(userId, { account_username: accountId });
  return documents;
}

export { getPostsInfo }