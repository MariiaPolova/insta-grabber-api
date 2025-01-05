import listActions from '../../../../database/collections/lists';
import { Timestamp } from 'firebase-admin/firestore'; // todo abstract from firebase-admin
import { IList } from "../../../../database/interfaces/lists";
import { APIError } from "../../../../common/BaseError";

async function createList(listName: string) {
  try {
    const list: IList = {
      name: listName,
      created_at: Timestamp.fromDate(new Date())
    };
    return listActions.createOne(list);
  } catch (e) {
    throw new APIError(e);
  }
}

export { createList }