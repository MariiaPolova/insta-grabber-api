import { collections } from "../../../../database/constants";
import { IAccount } from "../../../../database/interfaces/accounts";
import * as dbService from "../../../../database/service";

async function createAccount (username: string, buildId: string) {
  const account: IAccount = {
    username,
    last_build_id: buildId,
    last_fetch_date: new Date()
  };
  return dbService.postDocument<IAccount>(collections.accounts, account);
}

export { createAccount }