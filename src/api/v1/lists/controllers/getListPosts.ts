import { getSignedImage } from "../../../../storage/storage.service";
import { IPost } from "../../../../database/interfaces/posts";
import { getPostsByList } from "../methods/getAllPostsByListId";
import { StatusCodes } from "http-status-codes";


export const getListPosts = async (req, res) => {
    const { params } = req;
    const { listId } = params;
    const documents: IPost[] = await getPostsByList(listId);
    const documentsWithSignedUrls = await Promise.all(documents.map(async (doc) => {
        const image = await getSignedImage(doc.display_url);
        return { ...doc, display_url: image };
    }))
    res.status(StatusCodes.OK).send(documentsWithSignedUrls);
}