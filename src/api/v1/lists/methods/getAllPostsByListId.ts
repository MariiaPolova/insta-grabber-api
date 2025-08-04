import { IPost } from "../../../../database/interfaces/posts.js";
import listActions from '../../../../database/collections/lists.js';
import postActions from '../../../../database/collections/posts.js';
import { getFieldName } from "../../../../common/commonMethods.js";
import { APIError } from "../../../../common/BaseError.js";

async function getPostsByList(listId: string): Promise<IPost[]> {
  try {
    const list = await listActions.getOne({ id: listId });
    if (!list) {
      throw new APIError(`List with id ${listId} not found`);
    }
    
    const { posts_ids } = list;
    if (!posts_ids?.length) {
      return [];
    }
    const documents = await postActions.getDocumentsInArray(getFieldName<IPost>('post_id'), posts_ids);
    return documents;
  } catch (e) {
    throw new APIError(String(e));
  }
}

export { getPostsByList }