
import * as dbService from "../../../../database/database.service";
import { collections } from "../../../../database/constants";
import { IAccount } from "../../../../database/interfaces/accounts";

export const getAccount = async (req, res) => {
    const { params } = req;
    const { username } = params;
    const document: IAccount = await dbService.getDocument<IAccount>(collections.accounts, { username });
    res.send({
        ...document,
        created_at: document?.created_at.toDate(),
        start_fetch_date: document?.start_fetch_date.toDate(),
        end_fetch_date: document?.end_fetch_date.toDate()
        });
}