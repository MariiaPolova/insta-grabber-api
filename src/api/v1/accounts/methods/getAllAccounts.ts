import { collections } from "../../../../database/constants";
import { IAccount } from "../../../../database/interfaces/accounts";
import * as dbService from "../../../../database/service";

async function getAccountInfo (): Promise<IAccount[]> {
  const documents = await dbService.getAllDocuments<IAccount>(collections.accounts);
  return documents;
}

export { getAccountInfo }