import { collections } from "../../../../database/constants";
import { IAccount } from "../../../../database/interfaces/accounts";
import * as dbService from "../../../../database/database.service";

export const getAccountInfo = async (username) => {
    const document = await dbService.getDocument<IAccount>(collections.accounts, username);
    return document;
}