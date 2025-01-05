import { collections } from "../constants";
import { IAccount } from "../interfaces/accounts";
import { getCollectionLayer } from "./common";

const collectionName = collections.accounts;

const layer = getCollectionLayer<IAccount>(collectionName);
export default layer;
