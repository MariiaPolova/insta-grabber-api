import { StatusCodes } from 'http-status-codes';

import { Request, Response } from 'express';
import { IUser } from '../../../../database/interfaces/users.js';
import accountActions from '../../../../database/collections/accounts.js';

export const getAccounts = async (req: Request, res: Response) => {
    // Get authenticated user from middleware
    const user = (req as any).user as IUser;
    
    // If user has an accountId, only return that account
    if (user.accountId) {
        const userAccount = await accountActions.getOne({ id: user.accountId });
        res.status(StatusCodes.OK).send(userAccount ? [userAccount] : []);
        return;
    }
    
    // If no account associated, return empty array
    res.status(StatusCodes.OK).send([]);
}