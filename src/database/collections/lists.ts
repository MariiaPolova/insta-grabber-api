import { collections } from "../constants";
import { IList } from "../interfaces/lists";
import { getCollectionLayer } from "./common";

const collectionName = collections.lists;

export default getCollectionLayer<IList>(collectionName);
