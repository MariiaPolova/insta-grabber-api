import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { APIError } from "../../../../common/BaseError.js";
import postActions from '../../../../database/collections/posts.js';

export const removePostSchema = {
    params: Joi.object({
        id: Joi.string().required(),
    })
};

export const removePost = async (req: Request, res: Response) => {
    try {
        const { params } = req;
        const { id } = params;
        await  postActions.removeByField('post_id', id);

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        throw new APIError(String(err));
    }
}