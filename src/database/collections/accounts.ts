import { collections } from "../constants";
import { getCollectionLayer } from "./common";

const collectionName = collections.accounts;

const layer = getCollectionLayer(collectionName);
export default layer;
