import { collections } from "../constants.js";
import { IAccount } from "../interfaces/accounts.js";
import { getCollectionLayer } from "./common.js";

const collectionName = collections.accounts;

const layer = getCollectionLayer<IAccount>(collectionName);
export default layer;
