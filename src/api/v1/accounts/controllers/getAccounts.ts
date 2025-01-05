import { StatusCodes } from 'http-status-codes';
import accountActions from '../../../../database/collections/accounts';

export const getAccounts = async (req, res) => {
    const documents = await accountActions.getAll();
    res.status(StatusCodes.OK).send(documents);
}