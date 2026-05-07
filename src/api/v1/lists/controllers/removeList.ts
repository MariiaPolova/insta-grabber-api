import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { APIError } from "../../../../common/BaseError.js";
import listActions from '../../../../database/collections/lists.js';
import { AuthenticatedRequest } from "../../../../middleware/authMiddleware.js";

export const removeListSchema = {
    params: Joi.object({
        id: Joi.string().required(),
    })
};

export const removeList = async (req: Request, res: Response) => {
    try {
        const { params } = req;
        const { id } = params;
        const user_id = (req as AuthenticatedRequest).user.id;
        await  listActions.remove(user_id!, id);

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        throw new APIError(String(err));
    }
}