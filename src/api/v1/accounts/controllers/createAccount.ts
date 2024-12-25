
import { firestore } from "firebase-admin";
import * as dbService from "../../../../database/database.service";
import { collections } from "../../../../database/constants";
import { BadRequestError } from "../../../../common/BaseError";

export const createAccount = async (req, res, next) => {
    try {
        const { username } = req.body;
        if (!username) {
            throw new BadRequestError(`Username is missing`)
        }

        const existingAccount = await dbService.getDocument(collections.accounts, { username });

        if (existingAccount) {
            throw new BadRequestError(`Account with  ${username} username is already created`);
        }
        const document = await dbService.postDocument(collections.accounts, { username, created_at: firestore.Timestamp.now() });
        res.status(201).send(document);
    } catch (e) {
        next(e);
    }
}