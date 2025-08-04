import { IAccount } from "../../../../database/interfaces/accounts.js";
import accountActions from '../../../../database/collections/accounts.js';

async function getAccountsInfo (): Promise<IAccount[]> {
  const documents = await accountActions.getAll();
  return documents;
}

export { getAccountsInfo }