import { IPost } from "../../../../database/interfaces/posts.js";
import listActions from '../../../../database/collections/lists.js';
import postActions from '../../../../database/collections/posts.js';
import { getFieldName } from "../../../../common/commonMethods.js";
import { APIError } from "../../../../common/BaseError.js";
import { IListWithPosts } from "../../../../database/interfaces/lists.js";

async function getPostsByList(listId: string): Promise<IListWithPosts> {
  try {
    const list = await listActions.getOne({ id: listId });
    if (!list) {
      throw new APIError(`List with id ${listId} not found`);
    }
    
    const { posts_ids } = list;
    if (!posts_ids?.length) {
      return { ...list, posts_ids: [] };
    }
    const documents = await postActions.getDocumentsInArray(getFieldName<IPost>('post_id'), posts_ids);
    return { ...list, posts_ids: documents };
  } catch (e) {
    throw new APIError(String(e));
  }
}

export { getPostsByList }