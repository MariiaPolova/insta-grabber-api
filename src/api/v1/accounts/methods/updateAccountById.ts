import { IAccount } from "../../../../database/interfaces/accounts.js";
import accountActions from '../../../../database/collections/accounts.js';

async function updateAccountById (user_id: string, account_id: string, accountData: Partial<IAccount>) {
  return accountActions.updateOne(user_id, account_id, accountData);
}

export { updateAccountById }