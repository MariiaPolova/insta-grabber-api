import { collections } from "../../../../database/constants";
import { IAccount } from "../../../../database/interfaces/accounts";
import * as dbService from "../../../../database/database.service";
import { Timestamp } from 'firebase-admin/firestore'; // todo abstract from firebase-admin

async function createAccount (username: string) {
  const account: IAccount = {
    username,
    created_at: Timestamp.fromDate(new Date())
  };
  return dbService.postDocument<IAccount>(collections.accounts, account);
}

export { createAccount }