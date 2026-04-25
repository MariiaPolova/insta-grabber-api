import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { APIError } from "../../../../common/BaseError.js";
import listActions from '../../../../database/collections/lists.js';

export const removeListSchema = {
    params: Joi.object({
        id: Joi.string().required(),
    })
};

export const removeList = async (req: Request, res: Response) => {
    try {
        const { params } = req;
        const { id } = params;
        await  listActions.remove(id);

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        throw new APIError(String(err));
    }
}