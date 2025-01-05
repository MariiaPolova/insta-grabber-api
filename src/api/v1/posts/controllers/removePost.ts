import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../../../../common/BaseError";
import postActions from '../../../../database/collections/posts';

export const removePostSchema = {
    params: Joi.object({
        id: Joi.string().length(20).required(),
    })
};

export const removePost = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        await  postActions.remove(id);

        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        throw new APIError(err);
    }
}