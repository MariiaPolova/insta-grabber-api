import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { getSignedImage } from "../../../../storage/storage.service.js";
import { IPost } from "../../../../database/interfaces/posts.js";
import { getPostsInfo } from "../methods/getAllPostsById.js";


export const getAccountPosts = async (req: Request, res: Response) => {
    const { params } = req;
    const { accountUsername } = params;
    const documents: IPost[] = await getPostsInfo(accountUsername);
    const documentsWithSignedUrls = await Promise.all(documents.map(async (doc) => {
        const image = await getSignedImage(doc.display_url);
        return { ...doc, display_url: image };
    }))
    res.status(StatusCodes.OK).send(documentsWithSignedUrls);
}