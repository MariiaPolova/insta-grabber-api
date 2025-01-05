import { IAccount } from "../../../../database/interfaces/accounts";
import accountActions from '../../../../database/collections/accounts';

async function updateAccountById (id: string, accountData: Partial<IAccount>) {
  return accountActions.updateOne(id, accountData);
}

export { updateAccountById }