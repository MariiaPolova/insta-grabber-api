
import { firestore } from "firebase-admin";
import * as dbService from "../../../../database/database.service";
import { collections } from "../../../../database/constants";
import { AppError } from "../../../../common/appError";

export const createAccount = async (req, res) => {
    const { username } = req.body;
    if (!username) {
        throw new AppError(`Username is missing`, false)
    }

    const existingAccount = await dbService.getDocument(collections.accounts, { username });

    if (existingAccount) {
        throw new AppError(`Account with  ${username} username is already created`, false);
    }
    const document = await dbService.postDocument(collections.accounts, { username, created_at: firestore.Timestamp.now() });
    res.status(201).send(document);
}