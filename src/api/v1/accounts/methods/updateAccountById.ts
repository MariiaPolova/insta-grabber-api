import { collections } from "../../../../database/constants";
import { IAccount } from "../../../../database/interfaces/accounts";
import * as dbService from "../../../../database/database.service";

async function updateAccountById (id: string, accountData: Partial<IAccount>) {
  return dbService.updateDocument<IAccount>(collections.accounts, id, accountData);
}

export { updateAccountById }