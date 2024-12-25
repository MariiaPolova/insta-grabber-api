import { collections } from "../../../../database/constants";
import * as dbService from "../../../../database/database.service";
import { IList } from "../../../../database/interfaces/lists";
import { BadRequestError, NotFoundError } from "../../../../common/BaseError";
import { IPost } from "../../../../database/interfaces/posts";

async function modifyListPosts(listId: string, postId: string, action: 'add' | 'remove') {
  const [list, post] = await Promise.all([
    dbService.getDocument<IList>(collections.lists, { id: listId }),
    dbService.getDocument<IPost>(collections.posts, { id: postId }),
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

  return dbService.updateDocument<IList>(collections.lists, listId, {
    ...list, posts_ids: newPosts
  } as IList);
}

export { modifyListPosts }