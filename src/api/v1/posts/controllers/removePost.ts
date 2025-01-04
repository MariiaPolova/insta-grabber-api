import Joi from "joi";
import * as dbService from "../../../../database/database.service";
import { collections } from "../../../../database/constants";
import { APIError } from "../../../../common/BaseError";
import { StatusCodes } from "http-status-codes";

export const removePostSchema = {
    params: Joi.object({
        id: Joi.string().length(20).required(),
    })
};

export const removePost = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        await dbService.removeDocumentById(collections.posts, id);

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        throw new APIError(err);
    }
}