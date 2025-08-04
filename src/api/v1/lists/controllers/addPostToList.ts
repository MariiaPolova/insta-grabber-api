import { StatusCodes } from "http-status-codes";

import { Request, Response, NextFunction } from 'express';
import { modifyListPosts } from "../methods/modifyListPosts.js";



export const addPostToList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { params } = req;
        const { postId, listId } = params;

        await modifyListPosts(listId, postId, 'add');

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        next(err);
    }
}