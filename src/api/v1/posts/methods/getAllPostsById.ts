import { IPost } from "../../../../database/interfaces/posts";
import postActions from '../../../../database/collections/posts';

async function getPostsInfo (accountId: string): Promise<IPost[]> {
  const documents = await postActions.getAll({ account_username: accountId });
  return documents;
}

export { getPostsInfo }