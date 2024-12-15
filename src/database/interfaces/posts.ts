enum MediaType {
    video = 'Video',
}

interface IInstagramPost {
inputUrl: string,
id: string,
type: MediaType,
shortCode: string,
caption: string,
hashtags: string[],
mentions: string[],
url: string,
commentsCount: number,
firstComment: string,
latestComments: string[],
dimensionsHeight: number,
dimensionsWidth: number,
displayUrl: string,
images: string[],
videoUrl: string,
alt: string | null,
likesCount: number,
videoViewCount: number,
videoPlayCount: number,
timestamp: string,
childPosts: number[],
ownerFullName: string,
ownerUsername: string,
ownerId: string,
productType: string,
videoDuration: number,
isSponsored: boolean,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
taggedUsers: any[], // object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
musicInfo: any, // object
}

interface IPost {
    account_username: string;
    post_id: string;
    media_type: MediaType;
    caption: string;
    hashtags: string[];
    url: string;
    display_url: string;
    video_url?: string;
    images: string[];
    created_at: Date;
}

export { IPost, IInstagramPost };