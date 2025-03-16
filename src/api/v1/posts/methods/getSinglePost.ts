import { IPost } from "../../../../database/interfaces/posts";
import postActions from '../../../../database/collections/posts';

async function getSinglePostInfo (id: string): Promise<IPost> {
  const document = await postActions.getOne({ id });
  return document;
}

export { getSinglePostInfo }