
import { NextFunction, Request, Response } from 'express';
import { modifyListPosts } from "../methods/modifyListPosts";


export const removePostFromList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { params } = req;
        const { postId, listId } = params;
        await modifyListPosts(listId, postId, 'remove');

        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}