import { IPost } from "../../../../database/interfaces/posts";
import postActions from '../../../../database/collections/posts';

async function getSinglePostInfo (id: string): Promise<IPost> {
  const document = await postActions.getOne({ key: 'post_id', value: id });
  return document;
}

export { getSinglePostInfo }