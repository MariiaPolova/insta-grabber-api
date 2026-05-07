import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { createAccountPosts } from "../methods/createPosts.js";
import { AuthenticatedRequest } from "../../../../middleware/authMiddleware.js";

export const populateAccountPostsSchema = {
    params: Joi.object({
        accountUsername: Joi.string().min(3).max(30).required(),
        renewFetch: Joi.string().valid('true', 'false').default('false')
    })
};

export const populateAccountPosts = async (req: Request, res: Response) => {
    const { params, query } = req;
    const { accountUsername, renewFetch } = params;
    const { limit = 10 } = query;
    const user_id = (req as AuthenticatedRequest).user.id;
    try {
        await createAccountPosts(user_id!, {
            accountUsername,
            limit: parseInt(limit.toString(), 10),
            renewFetch: renewFetch === 'true'
        });
        res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Failed to populate posts for account ${accountUsername}: ${(error as Error)?.message}`);
    }
}