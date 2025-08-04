import { IAccount } from "../../../../database/interfaces/accounts.js";
import accountActions from '../../../../database/collections/accounts.js';

async function updateAccountById (id: string, accountData: Partial<IAccount>) {
  return accountActions.updateOne(id, accountData);
}

export { updateAccountById }