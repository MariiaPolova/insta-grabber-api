import { listItems } from "../client";

// Prepare Actor input
const input = (username, limit) => ({
    "username": [
        username
    ],
    "resultsLimit": limit
});

export const getAccountPostsByUsername = (username, limit = 10) => {
    const accountInput = input(username, limit);
    return listItems(accountInput);
}
