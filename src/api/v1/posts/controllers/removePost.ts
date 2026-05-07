import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { APIError } from "../../../../common/BaseError.js";
import postActions from '../../../../database/collections/posts.js';
import { AuthenticatedRequest } from "../../../../middleware/authMiddleware.js";

export const removePostSchema = {
    params: Joi.object({
        id: Joi.string().required(),
    })
};

export const removePost = async (req: Request, res: Response) => {
    try {
        const { params } = req;
        const { id } = params;
        const user_id = (req as AuthenticatedRequest).user.id;
        await  postActions.removeByField(user_id!, 'post_id', id);

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        throw new APIError(String(err));
    }
}