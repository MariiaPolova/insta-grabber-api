import { IAccount } from "../../../../database/interfaces/accounts";
import accountActions from '../../../../database/collections/accounts';

async function getAccountInfo (): Promise<IAccount[]> {
  const documents = await accountActions.getAll();
  return documents;
}

export { getAccountInfo }