import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { getSignedImage } from "../../../../storage/storage.service.js";
import { IPost } from "../../../../database/interfaces/posts.js";
import { IUser } from "../../../../database/interfaces/users.js";
import { getPostsInfo } from "../methods/getAllPostsById.js";
import accountActions from "../../../../database/collections/accounts.js";
import { AuthenticatedRequest } from "../../../../middleware/authMiddleware.js";


export const getAccountPosts = async (req: Request, res: Response) => {
    const { params } = req;
    const { accountUsername } = params;
    
    // Get authenticated user from middleware
    const user = (req as AuthenticatedRequest).user as IUser;
    
    // Get the user's account to verify ownership
    const userAccount = await accountActions.getOne({ key: 'username', value: accountUsername });
    // TODO extend to multiple filters by user.id
    
    if (!userAccount) {
        res.status(StatusCodes.NOT_FOUND).json({
            error: 'Account not found',
            message: 'Associated Instagram account not found'
        });
        return;
    }
    
    const documents: IPost[] = await getPostsInfo(accountUsername, user.id!);
    const documentsWithSignedUrls = await Promise.all(documents.map(async (doc) => {
        const image = await getSignedImage(doc.display_url);
        return { ...doc, display_url: image };
    }))
    res.status(StatusCodes.OK).send(documentsWithSignedUrls);
}