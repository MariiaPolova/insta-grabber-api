
import * as dbService from "../../../../database/service";
import { collections } from "../../../../database/constants";

export const getAccounts = async (req, res) => {
    const documents = await dbService.getAllDocuments(collections.accounts);
    res.send(documents);
}