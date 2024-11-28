import { collections } from "../../../../database/constants";
import { IAccount } from "../../../../database/interfaces/accounts";
import { IPost, IInstagramPost } from "../../../../database/interfaces/posts";
import * as dbService from "../../../../database/service";
import { getLastRunBuildId } from "../../../../service/client";
import { getAccountPostsByUsername } from "../../../../service/methods/getAccountPostsByUsername";
import { createAccount } from "../../accounts/methods/createAccount";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const NEW_FETCH = 30;

async function createPosts (posts: IInstagramPost[]) {
  const accountPosts: IPost[] = posts.map(post => ({
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
  return dbService.postDocuments<IPost>(collections.posts, accountPosts);
}

async function createAccountPosts(accountUsername: string, limit: number) {
  const existingAccountInfo = await dbService.getDocument(collections.accounts, { username: accountUsername }) as IAccount;
  const { last_fetch_date: lastFetchDate } = existingAccountInfo;

  // disallow fetching if last fetch was earlier than one week
  if (new Date(lastFetchDate) < new Date(Date.now() - ONE_WEEK_MS)) {
    throw new Error('Early fetch is not allowed')
  }

  const fetchLimit = existingAccountInfo ? limit : NEW_FETCH;

  const accountInput = await getAccountPostsByUsername(accountUsername, fetchLimit);

  await createPosts(accountInput);

  if(!existingAccountInfo) {
      const lastBuild = await getLastRunBuildId();
      await createAccount(accountUsername, lastBuild);
  }
}

export { createAccountPosts }