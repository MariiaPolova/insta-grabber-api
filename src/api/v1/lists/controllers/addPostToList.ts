import { StatusCodes } from "http-status-codes";
import { modifyListPosts } from "../methods/modifyListPosts";


export const addPostToList = async (req, res, next) => {
    try {
        const { params } = req;
        const { postId, listId } = params;

        await modifyListPosts(listId, postId, 'add');

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        next(err);
    }
}