import { createAccountPosts } from "../methods/createPosts";

export const populateAccountPosts = async (req, res) => {
    const { params, query } = req;
    const { accountUsername } = params;
    const { limit = 10 } = query;

    await createAccountPosts(accountUsername, parseInt(limit.toString(), 10));
    res.sendStatus(200);
}