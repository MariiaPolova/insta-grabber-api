
import { NextFunction, Request, Response } from 'express';
import { modifyListPosts } from "../methods/modifyListPosts.js";
import { AuthenticatedRequest } from '../../../../middleware/authMiddleware.js';


export const removePostFromList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { params } = req;
        const { postId, listId } = params;
        const user_id = (req as AuthenticatedRequest).user.id;
        await modifyListPosts(user_id!, listId, postId, 'remove');

        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
}