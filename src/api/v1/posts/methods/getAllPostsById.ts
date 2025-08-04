import { IPost } from "../../../../database/interfaces/posts.js";
import postActions from '../../../../database/collections/posts.js';

async function getPostsInfo (accountId: string): Promise<IPost[]> {
  const documents = await postActions.getAll({ account_username: accountId });
  return documents;
}

export { getPostsInfo }