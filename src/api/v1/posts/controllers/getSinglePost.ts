import { getSignedImage } from "../../../../storage/storage.service";
import { IPost } from "../../../../database/interfaces/posts";
import { StatusCodes } from "http-status-codes";
import { getSinglePostInfo } from "../methods/getSinglePost";


export const getSinglePost = async (req, res) => {
    const { params } = req;
    const { id } = params;
    const document: IPost = await getSinglePostInfo(id);

    if (!document) {
        return res.status(StatusCodes.NOT_FOUND).send('Post not found');
    }

    const signedImage = await getSignedImage(document.display_url);
    const documentWithSignedUrls = { 
        ...document, 
        display_url: signedImage, 
        created_at: document.created_at.toDate(),
    };
    res.status(StatusCodes.OK).send(documentWithSignedUrls);
}