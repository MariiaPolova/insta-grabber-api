import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { IUser } from '../../../../database/interfaces/users.js';

export const getCurrentUser = async (req: Request, res: Response) => {
    const user = (req as any).user as IUser;
    res.status(StatusCodes.OK).send(user);
}
