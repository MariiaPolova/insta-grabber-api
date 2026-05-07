
import { Request, Response } from 'express';
import accountActions from '../../../../database/collections/accounts.js';
import { AuthenticatedRequest } from '../../../../middleware/authMiddleware.js';

export const getAccount = async (req: Request, res: Response) => {
    const { params } = req;
    const { username } = params;
        const user_id = (req as AuthenticatedRequest).user.id;
    const document = await accountActions.getOne(user_id!, { key: 'username', value: username });
    res.send({
        ...document,
        created_at: document?.created_at.toDate(),
        start_fetch_date: document?.start_fetch_date?.toDate(),
        end_fetch_date: document?.end_fetch_date?.toDate()
        });
}