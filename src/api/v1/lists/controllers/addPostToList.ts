import { StatusCodes } from "http-status-codes";

import { Request, Response, NextFunction } from 'express';
import { modifyListPosts } from "../methods/modifyListPosts.js";
import { AuthenticatedRequest } from "../../../../middleware/authMiddleware.js";



export const addPostToList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { params } = req;
        const { postId, listId } = params;
        const user_id = (req as AuthenticatedRequest).user.id;
        await modifyListPosts(user_id!, listId, postId, 'add');

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        next(err);
    }
}