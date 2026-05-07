
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import listActions from '../../../../database/collections/lists.js';
import { AuthenticatedRequest } from '../../../../middleware/authMiddleware.js';


export const getLists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = (req as AuthenticatedRequest).user.id;
        const documents = await listActions.getAll(user_id!);
        res.status(StatusCodes.OK).send(documents);
    } catch (err) {
        next(err);
    }
}