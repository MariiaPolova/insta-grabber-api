import { collections } from "../../../../database/constants";
import { IPost } from "../../../../database/interfaces/posts";
import * as dbService from "../../../../database/database.service";

async function getPostsInfo (accountId: string): Promise<IPost[]> {
  const documents = await dbService.getAllDocuments<IPost>(collections.posts, { accountId });
  return documents;
}

export { getPostsInfo }