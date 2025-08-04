import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { getSignedImage } from "../../../../storage/storage.service.js";
import { IPost } from "../../../../database/interfaces/posts.js";
import { getPostsByList } from "../methods/getAllPostsByListId.js";


export const getListPosts = async (req: Request, res: Response) => {
    const { params } = req;
    const { listId } = params;
    const documents: IPost[] = await getPostsByList(listId);
    const documentsWithSignedUrls = await Promise.all(documents.map(async (doc) => {
        const image = await getSignedImage(doc.display_url);
        return { ...doc, display_url: image };
    }))
    res.status(StatusCodes.OK).send(documentsWithSignedUrls);
}