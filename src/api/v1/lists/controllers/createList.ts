import { StatusCodes } from "http-status-codes";
import { createList } from "../methods/createList";
import Joi from "joi";

export const createListSchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required(),
    })
}

export const createNewList = async (req, res, next) => {
    try {
        const { body } = req;
        const { name } = body;

        const newList = await createList(name);
        res.status(StatusCodes.CREATED).send(newList);
    } catch (err) {
        next(err);
    }
}