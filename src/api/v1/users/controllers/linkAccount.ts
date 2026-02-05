import Joi from "joi";
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Timestamp } from 'firebase-admin/firestore';
import { IUser } from '../../../../database/interfaces/users.js';
import userActions from '../../../../database/collections/users.js';
import accountActions from '../../../../database/collections/accounts.js';

export const linkAccountSchema = {
    body: Joi.object({
        accountId: Joi.string().required()
    })
};

export const linkAccount = async (req: Request, res: Response) => {
    const user = (req as any).user as IUser;
    const { accountId } = req.body;
    
    // Verify the account exists
    const account = await accountActions.getOne({ id: accountId });
    
    if (!account) {
        res.status(StatusCodes.NOT_FOUND).json({
            error: 'Account not found',
            message: 'The specified account does not exist'
        });
        return;
    }
    
    // Update user with the account ID
    const updatedUser = await userActions.updateOne(user.id!, {
        ...user,
        accountId,
        updated_at: Timestamp.now()
    } as IUser);
    
    res.status(StatusCodes.OK).send(updatedUser);
}
