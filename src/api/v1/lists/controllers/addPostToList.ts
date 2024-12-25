import { BadRequestError } from "../../../../common/BaseError";
import { modifyListPosts } from "../methods/modifyListPosts";


export const addPostToList = async (req, res, next) => {
    try {
        const { params } = req;
        const { postId, listId } = params;
        if(!postId || !listId) {
            throw new BadRequestError('List or post is not provided'); // todo change with swagger
        }
        console.log(postId, listId)
        await modifyListPosts(listId, postId, 'add');

        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}