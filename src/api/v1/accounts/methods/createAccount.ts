import { IAccount } from "../../../../database/interfaces/accounts.js";
import { Timestamp } from 'firebase-admin/firestore'; // todo abstract from firebase-admin
import accountActions from '../../../../database/collections/accounts.js';

async function createAccount (username: string, full_name: string) {
  const account: IAccount = {
    username,
    full_name,
    created_at: Timestamp.fromDate(new Date())
  };
  return accountActions.createOne(account);
}

export { createAccount }