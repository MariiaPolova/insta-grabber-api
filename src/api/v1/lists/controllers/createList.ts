import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from 'express';
import { createList } from "../methods/createList.js";
import Joi from "joi";
import { AuthenticatedRequest } from "../../../../middleware/authMiddleware.js";

export const createListSchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required(),
    })
}

export const createNewList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body } = req;
        const { name } = body;

        const user_id = (req as AuthenticatedRequest).user.id;
        const newList = await createList(user_id!, name);
        res.status(StatusCodes.CREATED).send(newList);
    } catch (err) {
        next(err);
    }
}