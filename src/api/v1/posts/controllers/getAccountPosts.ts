import * as dbService from "../../../../database/database.service";
import { collections } from "../../../../database/constants";


export const getAccountPosts = async (req, res) => {
    const { params } = req;
    const { accountUsername } = params;
    // const accountPosts = await getAccountPostsByUsername(accountUsername);
    const documents = await dbService.getAllDocuments(collections.posts, { account_username: accountUsername });
    res.send(documents);
}