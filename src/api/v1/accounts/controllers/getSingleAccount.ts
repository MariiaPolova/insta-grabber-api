
import * as dbService from "../../../../database/service";
import { collections } from "../../../../database/constants";
import { IAccount } from "../../../../database/interfaces/accounts";

export const getAccount = async (req, res) => {
    const { params } = req;
    const { username } = params;
    const document: IAccount = await dbService.getDocument<IAccount>(collections.accounts, { username });
    res.send({
        ...document,
        last_fetch_date: document?.last_fetch_date.toDate()
        });
}