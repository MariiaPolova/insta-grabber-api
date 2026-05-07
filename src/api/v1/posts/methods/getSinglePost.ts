import { IPost } from "../../../../database/interfaces/posts.js";
import postActions from '../../../../database/collections/posts.js';

async function getSinglePostInfo (userId: string, postId: string): Promise<IPost | null> {
  if (!postId) {
    throw new Error("Post ID is required");
  }
  const document = await postActions.getOne(userId, { id: postId });
  return document || null;
}

export { getSinglePostInfo }