import { Timestamp } from 'firebase-admin/firestore'; // todo abstract from firebase-admin
import { IAccount } from "../../../../database/interfaces/accounts.js";
import { IPost, IInstagramPost } from "../../../../database/interfaces/posts.js";
import accountActions from '../../../../database/collections/accounts.js';
import postActions from '../../../../database/collections/posts.js';
import { getLastRunBuildId } from "../../../../service/client.js";
import { getAccountPostsByUsername } from "../../../../service/methods/getAccountPostsByUsername.js";
import { uploadFileFromCDN } from "../../../../storage/storage.service.js";
import { updateAccountById } from "../../accounts/methods/updateAccountById.js";
import { getFieldName } from '../../../../common/commonMethods.js';
import { APIError } from '../../../../common/BaseError.js';

// const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const NEW_FETCH = 5;

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
        created_at: Timestamp.fromMillis(parseInt(post.timestamp))
      }))

    // const uploadVideoFilesToStorageOps = posts
    // .filter(post => post.videoUrl)
    // .map(post => uploadFileFromCDN(post.videoUrl, `video-${post.id}`));

    console.log('Start uploading images to Firebase Storage');
    const uploadedImageUrls = await Promise.all(posts.map(post => uploadFileFromCDN(post.displayUrl, `img-${post.id}`)));
    if (uploadedImageUrls.length) {
      accountPosts.forEach(accountPost => {
        const imageUrl = uploadedImageUrls.find(({ url }) => url.includes(accountPost.post_id));
        if (imageUrl) {
          accountPost.display_url = imageUrl.path;
        }
      })
      console.log('Start uploading images to Firebase Storage');
    }

    // if(uploadVideoFilesToStorageOps.length) {
    //   const uploadedVideoUrls = await Promise.all(uploadVideoFilesToStorageOps);
    //   accountPosts.forEach(accountPost => {
    //     const videoUrl = uploadedVideoUrls.find(({url}) => url.includes(accountPost.post_id));
    //     if (videoUrl) {
    //       accountPost.video_url = videoUrl.path;
    //     }
    //   })
    // }

    return postActions.createMany(accountPosts);
  } catch (error) {
    throw new APIError(String(error));
  }
}

async function createAccountPosts({ accountUsername, limit, renewFetch = false }
  : { accountUsername: string, limit: number, renewFetch?: boolean }) {
  const existingAccountInfo = await accountActions.getOne({ key: 'username', value: accountUsername }) as IAccount;

  if (!existingAccountInfo) {
    throw new APIError(`Account with username ${accountUsername} does not exist`);
  }

  const { start_fetch_date, end_fetch_date, id } = existingAccountInfo;
  // disallow fetching if last fetch was earlier than one week
  // if (new Date(lastFetchDate.toDate()) < new Date(Date.now() - ONE_WEEK_MS)) {
  //   throw new Error('Early fetch is not allowed')
  // }

  const params = {
    username: accountUsername,
    limit: limit || NEW_FETCH,
    ...(renewFetch && start_fetch_date ? { startFetchDate: start_fetch_date.valueOf() } : {})
    // ...(renewFetch && start_fetch_date ? { startFetchDate: new Date(start_fetch_date.toDate()) } : {})
  };

  const accountInput = await getAccountPostsByUsername(params);

  await createPosts(accountInput);

  const lastBuild = await getLastRunBuildId();
  if(id) {
    await updateAccountById(id, {
      // todo add description of account???
      last_build_id: lastBuild,
      start_fetch_date: end_fetch_date ?? Timestamp.fromDate(new Date()),
      end_fetch_date: Timestamp.fromDate(new Date())
    });
  }
}

export { createAccountPosts }