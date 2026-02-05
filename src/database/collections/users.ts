import { collections } from "../constants.js";
import { IUser } from "../interfaces/users.js";
import { getCollectionLayer } from "./common.js";

const collectionName = collections.users;

const layer = getCollectionLayer<IUser>(collectionName);
export default layer;
