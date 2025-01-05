import { collections } from "../constants";
import { IPost } from "../interfaces/posts";
import { getCollectionLayer } from "./common";

const collectionName = collections.posts;

export default getCollectionLayer<IPost>(collectionName);
