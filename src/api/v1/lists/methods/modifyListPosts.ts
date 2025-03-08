import { IList } from "../../../../database/interfaces/lists";
import { BadRequestError, NotFoundError } from "../../../../common/BaseError";
import listActions from '../../../../database/collections/lists';
import postActions from '../../../../database/collections/posts';

async function modifyListPosts(listId: string, postId: string, action: 'add' | 'remove') {
  const [list, post] = await Promise.all([
    listActions.getOne({ id: listId }),
    postActions.getOne({ key: 'post_id', value: postId }),
  ]);

  if (!list) {
    throw new NotFoundError('List is not found');
  }
  
  if(!post) {
    throw new NotFoundError('Post is not found');
  }

  const { posts_ids = [], name } = list;
  let newPosts;
  if (action === 'add') {
    if (posts_ids.includes(postId)) {
      throw new BadRequestError(`Post has already been added to ${name}`);
    }
    newPosts = [...posts_ids, postId];
  } else {
    newPosts = posts_ids.filter(id => id !== postId);
  }

  return listActions.updateOne(listId, {
    ...list, posts_ids: newPosts
  } as IList);
}

export { modifyListPosts }