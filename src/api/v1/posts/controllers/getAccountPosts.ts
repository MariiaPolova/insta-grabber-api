import { getSignedImage } from "../../../../storage/storage.service";
import { IPost } from "../../../../database/interfaces/posts";
import { StatusCodes } from "http-status-codes";
import { getPostsInfo } from "../methods/getAllPostsById";


export const getAccountPosts = async (req, res) => {
    const { params } = req;
    const { accountUsername } = params;
    const documents: IPost[] = await getPostsInfo(accountUsername);
    const documentsWithSignedUrls = await Promise.all(documents.map(async (doc) => {
        const image = await getSignedImage(doc.display_url);
        return { ...doc, display_url: image };
    }))
    res.status(StatusCodes.OK).send(documentsWithSignedUrls);
}