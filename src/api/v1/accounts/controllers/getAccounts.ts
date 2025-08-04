import { StatusCodes } from 'http-status-codes';

import { Request, Response } from 'express';
import accountActions from '../../../../database/collections/accounts.js';

export const getAccounts = async (req: Request, res: Response) => {
    const documents = await accountActions.getAll();
    res.status(StatusCodes.OK).send(documents);
}