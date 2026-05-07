import { StatusCodes } from 'http-status-codes';

import { Request, Response } from 'express';
import accountActions from '../../../../database/collections/accounts.js';
import { AuthenticatedRequest } from '../../../../middleware/authMiddleware.js';

export const getAccounts = async (req: Request, res: Response) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    
    const user_id = (req as AuthenticatedRequest).user.id;
    const documents = await accountActions.getAll(user_id!);
    
    console.log(`[Response] ${req.method} ${req.url} - Status: 200`);
    res.send(documents);
}