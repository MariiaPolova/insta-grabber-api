import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { getSignedImage } from "../../../../storage/storage.service.js";
import { IPost } from "../../../../database/interfaces/posts.js";
import { IUser } from "../../../../database/interfaces/users.js";
import { getPostsInfo } from "../methods/getAllPostsById.js";
import accountActions from "../../../../database/collections/accounts.js";


export const getAccountPosts = async (req: Request, res: Response) => {
    const { params } = req;
    const { accountUsername } = params;
    
    // Get authenticated user from middleware
    const user = (req as any).user as IUser;
    
    // Check if user has an associated account
    if (!user.accountId) {
        res.status(StatusCodes.FORBIDDEN).json({
            error: 'No account associated',
            message: 'User does not have an Instagram account linked'
        });
        return;
    }
    
    // Get the user's account to verify ownership
    const userAccount = await accountActions.getOne({ id: user.accountId });
    
    if (!userAccount) {
        res.status(StatusCodes.NOT_FOUND).json({
            error: 'Account not found',
            message: 'Associated Instagram account not found'
        });
        return;
    }
    
    // Verify the requested account matches the user's account
    if (userAccount.username !== accountUsername) {
        res.status(StatusCodes.FORBIDDEN).json({
            error: 'Access denied',
            message: 'You can only access posts from your own account'
        });
        return;
    }
    
    const documents: IPost[] = await getPostsInfo(accountUsername);
    const documentsWithSignedUrls = await Promise.all(documents.map(async (doc) => {
        const image = await getSignedImage(doc.display_url);
        return { ...doc, display_url: image };
    }))
    res.status(StatusCodes.OK).send(documentsWithSignedUrls);
}