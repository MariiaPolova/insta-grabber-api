import { collections } from "../../database/constants";
import { IPost, IInstagramPost } from "../../database/interfaces/posts";
import * as dbService from "../../database/service";

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

export { createPosts }