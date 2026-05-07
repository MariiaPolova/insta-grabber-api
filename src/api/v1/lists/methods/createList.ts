import { Timestamp } from 'firebase-admin/firestore'; // todo abstract from firebase-admin
import listActions from '../../../../database/collections/lists.js';
import { IList } from "../../../../database/interfaces/lists.js";
import { APIError } from "../../../../common/BaseError.js";

async function createList(user_id: string, listName: string) {
  try {
    const list: IList = {
      name: listName,
      created_at: Timestamp.fromDate(new Date()),
      user_id
    };
    return listActions.createOne(user_id, list);
  } catch (e) {
    throw new APIError(String(e));
  }
}

export { createList }