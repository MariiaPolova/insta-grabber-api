
import { firestore } from "firebase-admin";
import Joi from 'joi';
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../../../common/BaseError";
import accountActions from '../../../../database/collections/accounts';

export const createAccountSchema = {
    body: Joi.object({
        username: Joi.string().min(3).max(30).required(),
    })
};

export const createAccount = async (req, res, next) => {
    try {
        const { username } = req.body;
        const existingAccount = await accountActions.getOne({ key: 'username', value: username });

        if (existingAccount) {
            throw new BadRequestError(`Account with ${username} username is already created`);
        }
        const document = await accountActions.createOne({ 
            username, 
            created_at: firestore.Timestamp.now() 
        });
        return res.status(StatusCodes.CREATED).send(document);
    } catch (e) {
        next(e);
    }
}