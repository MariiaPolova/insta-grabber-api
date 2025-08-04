import { collections } from "../constants.js";
import { IPost } from "../interfaces/posts.js";
import { getCollectionLayer } from "./common.js";

const collectionName = collections.posts;

export default getCollectionLayer<IPost>(collectionName);
