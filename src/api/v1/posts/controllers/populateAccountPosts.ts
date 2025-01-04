import Joi from "joi";
import { createAccountPosts } from "../methods/createPosts";
import { StatusCodes } from "http-status-codes";

export const populateAccountPostsSchema = {
    params: Joi.object({
        accountUsername: Joi.string().min(3).max(30).required(),
    })
};

export const populateAccountPosts = async (req, res) => {
    const { params, query } = req;
    const { accountUsername } = params;
    const { limit = 10 } = query;

    await createAccountPosts(accountUsername, parseInt(limit.toString(), 10));
    res.sendStatus(StatusCodes.OK);
}