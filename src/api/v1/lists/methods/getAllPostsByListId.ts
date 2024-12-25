import { collections } from "../../../../database/constants";
import { IPost } from "../../../../database/interfaces/posts";
import * as dbService from "../../../../database/database.service";
import { IList } from "../../../../database/interfaces/lists";
import { getFieldName } from "../../../../common/commonMethods";
import { APIError } from "../../../../common/BaseError";

async function getPostsByList(listId: string): Promise<IPost[]> {
  try {
    const list = await dbService.getDocument<IList>(collections.posts, { id: listId });
    const { posts_ids } = list;
    if (posts_ids?.length) {
      return [];
    }
    const documents = await dbService.getDocumentsByArrayFilter<IPost>(collections.accounts, getFieldName<IPost>('post_id'), posts_ids);
    return documents;
  } catch (e) {
    throw new APIError(e);
  }
}

export { getPostsByList }