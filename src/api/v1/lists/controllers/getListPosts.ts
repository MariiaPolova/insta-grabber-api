import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { getSignedImage } from "../../../../storage/storage.service.js";
import { getPostsByList } from "../methods/getAllPostsByListId.js";
import { IListWithPosts } from "../../../../database/interfaces/lists.js";


export const getListPosts = async (req: Request, res: Response) => {
    const { params } = req;
    const { listId } = params;
    const list: IListWithPosts = await getPostsByList(listId);
    const documentsWithSignedUrls = await Promise.all(list.posts_ids.map(async (doc) => {
        const image = await getSignedImage(doc.display_url);
        return { ...doc, display_url: image };
    }))
    res.status(StatusCodes.OK).send({...list, posts_ids: documentsWithSignedUrls});
}