import { IPost } from "../../../../database/interfaces/posts.js";
import postActions from '../../../../database/collections/posts.js';

async function getSinglePostInfo (id: string): Promise<IPost | null> {
  if (!id) {
    throw new Error("Post ID is required");
  }
  const document = await postActions.getOne({ key: 'post_id', value: id });
  return document || null;
}

export { getSinglePostInfo }