import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { IUser } from '../../../../database/interfaces/users.js';
import { AuthenticatedRequest } from '../../../../middleware/authMiddleware.js';

export const getCurrentUser = async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user as IUser;
    res.status(StatusCodes.OK).send(user);
}
