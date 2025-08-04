import { listItems } from "../client";

// Prepare Actor input
const input = ({ username, limit, startFetchDate }) => ({
    "username": [
        username
    ],
    "resultsLimit": limit,
    "skipPinnedPosts": true,
    ...(startFetchDate ? { "onlyPostsNewerThan": startFetchDate } : {})
});

export const getAccountPostsByUsername = ({ username, limit, startFetchDate = null }) => {
    const accountInput = input({ username, limit, startFetchDate });
    return listItems(accountInput);
}
