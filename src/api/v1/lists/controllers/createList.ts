import { BadRequestError } from "../../../../common/BaseError";
import { createList } from "../methods/createList";

export const createNewList = async (req, res, next) => {
    try {
        const { body } = req;
        const { name } = body;
        if (!name) {
            throw new BadRequestError(`List name is missing`)
        }

        const newList = await createList(name);
        res.status(201).send(newList);
    } catch (err) {
        next(err);
    }
}