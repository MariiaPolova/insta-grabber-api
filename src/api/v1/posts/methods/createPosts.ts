import { Timestamp } from 'firebase-admin/firestore'; // todo abstract from firebase-admin
import { IAccount } from "../../../../database/interfaces/accounts";
import { IPost, IInstagramPost } from "../../../../database/interfaces/posts";
import accountActions from '../../../../database/collections/accounts';
import postActions from '../../../../database/collections/posts';
import { getLastRunBuildId } from "../../../../service/client";
import { getAccountPostsByUsername } from "../../../../service/methods/getAccountPostsByUsername";
import { uploadImageFromCDN } from "../../../../storage/storage.service";
import { updateAccountById } from "../../accounts/methods/updateAccountById";
import { getFieldName } from '../../../../common/commonMethods';
import { APIError } from '../../../../common/BaseError';

// const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const NEW_FETCH = 30;

async function createPosts(posts: IInstagramPost[]) {
  try {
    let uniquePosts: IInstagramPost[];
    const postsIdsToBeCreated = posts.map(post => post.id);
    const existingPosts = await postActions.getByArrayFilter(getFieldName<IPost>('post_id'), postsIdsToBeCreated);

    if (existingPosts?.length) {
      uniquePosts = posts.filter(post => {
        return !existingPosts.find(existing => existing.post_id === post.id)
      })
    } else {
      uniquePosts = posts; // TODO rethink with Map????
    }

    const accountPosts: IPost[] = uniquePosts
      .map(post => ({
        id: post.id,
        account_username: post.ownerUsername,
        post_id: post.id,
        media_type: post.type,
        caption: post.caption,
        hashtags: post.hashtags,
        url: post.url,
        display_url: post.displayUrl,
        video_url: post.videoUrl,
        images: post.images,
        created_at: new Date(post.timestamp)
      }))

    const uploadFilesToStorageOps = posts.map(post => uploadImageFromCDN(post.displayUrl, `img-${post.id}`));
    const uploadedUrls = await Promise.all(uploadFilesToStorageOps);
    if (uploadedUrls) {
      accountPosts.forEach(accountPost => accountPost.display_url = `img-${accountPost.post_id}`)
    }

    return postActions.createMany(accountPosts);
  } catch (error) {
    throw new APIError(error);
  }
}

async function createAccountPosts(accountUsername: string, limit: number) {
  const existingAccountInfo = await accountActions.getOne({ key: 'username', value: accountUsername }) as IAccount;

  // disallow fetching if last fetch was earlier than one week
  // if (new Date(lastFetchDate.toDate()) < new Date(Date.now() - ONE_WEEK_MS)) {
  //   throw new Error('Early fetch is not allowed')
  // }

  const accountInput = await getAccountPostsByUsername(accountUsername, limit || NEW_FETCH);

  await createPosts(accountInput);

  const lastBuild = await getLastRunBuildId();
  await updateAccountById(existingAccountInfo.id, {
    last_build_id: lastBuild,
    start_fetch_date: existingAccountInfo.end_fetch_date ?? Timestamp.fromDate(new Date()),
    end_fetch_date: Timestamp.fromDate(new Date())
  });
}

export { createAccountPosts }