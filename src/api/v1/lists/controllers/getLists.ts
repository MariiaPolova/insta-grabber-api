
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import listActions from '../../../../database/collections/lists.js';


export const getLists = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const documents = await listActions.getAll();
        res.status(StatusCodes.OK).send(documents);
    } catch (err) {
        next(err);
    }
}