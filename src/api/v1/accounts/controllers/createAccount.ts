
import * as admin from "firebase-admin";
import Joi from 'joi';
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from "../../../../common/BaseError.js";
import accountActions from '../../../../database/collections/accounts.js';

export const createAccountSchema = {
    body: Joi.object({
        username: Joi.string().min(3).max(30).required(),
    })
};


export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;
        const existingAccount = await accountActions.getOne({ key: 'username', value: username });

        if (existingAccount) {
            throw new BadRequestError(`Account with ${username} username is already created`);
        }
        const document = await accountActions.createOne({ 
            username,
            created_at: admin.firestore.Timestamp.now() 
        });
        res.status(StatusCodes.CREATED).send(document);
    } catch (e) {
        next(e);
    }
}