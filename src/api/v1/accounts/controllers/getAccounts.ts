import { StatusCodes } from 'http-status-codes';

import { Request, Response } from 'express';
import accountActions from '../../../../database/collections/accounts.js';
import { AuthenticatedRequest } from '../../../../middleware/authMiddleware.js';

export const getAccounts = async (req: Request, res: Response) => {
    // Get authenticated user from middleware
    const user = (req as AuthenticatedRequest).user;
    
    // If user has an accountId, only return that account
    if (user.id) {
        const userAccounts = await accountActions.getAll({ user_id: user.id! });
        res.status(StatusCodes.OK).send(userAccounts);
        return;
    }
    
    // If no account associated, return empty array
    res.status(StatusCodes.OK).send([]);
    return;
}