import { IPost } from "../../../../database/interfaces/posts";
import listActions from '../../../../database/collections/lists';
import postActions from '../../../../database/collections/posts';
import { getFieldName } from "../../../../common/commonMethods";
import { APIError } from "../../../../common/BaseError";

async function getPostsByList(listId: string): Promise<IPost[]> {
  try {
    const list = await listActions.getOne({ id: listId });
    const { posts_ids } = list;
    if (!posts_ids?.length) {
      return [];
    }
    const documents = await postActions.getDocumentsInArray(getFieldName<IPost>('post_id'), posts_ids);
    return documents;
  } catch (e) {
    throw new APIError(e);
  }
}

export { getPostsByList }