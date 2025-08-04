import { collections } from "../constants.js";
import { IList } from "../interfaces/lists.js";
import { getCollectionLayer } from "./common.js";

const collectionName = collections.lists;

export default getCollectionLayer<IList>(collectionName);
