import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { removeAccountAndPosts } from '../../../../database/collections/accounts.js';

export const removeAccount = async (req: Request, res: Response) => {
    console.log(`[Request] ${req.method} ${req.url} params:`, req.params);
    
    const { username } = req.params;
    const success = await removeAccountAndPosts(username);
    
    if (!success) {
        console.log(`[Response] ${req.method} ${req.url} - Status: ${StatusCodes.INTERNAL_SERVER_ERROR}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Failed to remove account');
        return;
    }
    
    console.log(`[Response] ${req.method} ${req.url} - Status: ${StatusCodes.OK}`);
    res.status(StatusCodes.OK).send({ message: 'Account and posts removed successfully' });
}
