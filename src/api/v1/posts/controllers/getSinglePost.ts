import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { getSignedImage } from "../../../../storage/storage.service.js";
import { IPost } from "../../../../database/interfaces/posts.js";
import { getSinglePostInfo } from "../methods/getSinglePost.js";
import { AuthenticatedRequest } from "../../../../middleware/authMiddleware.js";


export const getSinglePost = async (req: Request, res: Response) => {
    const { params } = req;
    const { id: postId } = params;
    const user_id = (req as AuthenticatedRequest).user.id;
    const document: IPost | null = await getSinglePostInfo(user_id!, postId);

    if (!document) {
        res.status(StatusCodes.NOT_FOUND).send('Post not found');
        return;
    }

    const signedImage = await getSignedImage(document.display_url);
    const documentWithSignedUrls = { 
        ...document, 
        id: postId,
        display_url: signedImage, 
        created_at: document.created_at.toDate(),
    };
    res.status(StatusCodes.OK).send(documentWithSignedUrls);
}