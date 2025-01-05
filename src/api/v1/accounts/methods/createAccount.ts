import { IAccount } from "../../../../database/interfaces/accounts";
import { Timestamp } from 'firebase-admin/firestore'; // todo abstract from firebase-admin
import accountActions from '../../../../database/collections/accounts';

async function createAccount (username: string) {
  const account: IAccount = {
    username,
    created_at: Timestamp.fromDate(new Date())
  };
  return accountActions.createOne(account);
}

export { createAccount }