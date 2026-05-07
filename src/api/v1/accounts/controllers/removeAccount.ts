import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import accountActions, { removeAccountAndPosts } from '../../../../database/collections/accounts.js';

export const removeAccount = async (req: Request, res: Response) => {
    console.log(`[Request] ${req.method} ${req.url} params:`, req.params);
    
    const user_id = (req as any).user.uid;
    const { username } = req.params;
    
    // Verify ownership
    const account = await accountActions.getOne(user_id, { key: 'username', value: username });
    if (!account || (account as any).user_id !== user_id) {
        console.log(`[Response] ${req.method} ${req.url} - Status: ${StatusCodes.FORBIDDEN}`);
        res.status(StatusCodes.FORBIDDEN).send('Not authorized');
        return;
    }
    
    const success = await removeAccountAndPosts(username, user_id);
    
    if (!success) {
        console.log(`[Response] ${req.method} ${req.url} - Status: ${StatusCodes.INTERNAL_SERVER_ERROR}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Failed to remove account');
        return;
    }
    
    console.log(`[Response] ${req.method} ${req.url} - Status: ${StatusCodes.OK}`);
    res.status(StatusCodes.OK).send({ message: 'Account and posts removed successfully' });
}
