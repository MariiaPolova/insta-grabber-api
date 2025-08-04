import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from 'express';
import { createList } from "../methods/createList.js";
import Joi from "joi";

export const createListSchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required(),
    })
}

export const createNewList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body } = req;
        const { name } = body;

        const newList = await createList(name);
        res.status(StatusCodes.CREATED).send(newList);
    } catch (err) {
        next(err);
    }
}