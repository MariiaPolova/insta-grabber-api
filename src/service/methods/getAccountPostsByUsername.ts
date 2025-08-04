import { IInstagramPost } from "../../database/interfaces/posts.js";
import { listItems } from "../client.js";

// Prepare Actor input
const input = ({ username, limit, startFetchDate }: { username: string; limit: number; startFetchDate?: string | null }) => ({
    "username": [
        username
    ],
    "resultsLimit": limit,
    "skipPinnedPosts": true,
    ...(startFetchDate ? { "onlyPostsNewerThan": startFetchDate } : {})
});

interface GetAccountPostsByUsernameParams {
    username: string;
    limit: number;
    startFetchDate?: string | null;
}

export const getAccountPostsByUsername = ({ username, limit, startFetchDate = null }: GetAccountPostsByUsernameParams) => {
    const accountInput = input({ username, limit, startFetchDate });
    return listItems<IInstagramPost>(accountInput);
}
