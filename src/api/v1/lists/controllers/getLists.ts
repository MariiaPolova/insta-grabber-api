
import { Request, Response } from 'express';
import * as dbService from "../../../../database/database.service";
import { collections } from "../../../../database/constants";
import { IList } from "../../../../database/interfaces/lists";


export const getLists = async (_req: Request, res: Response, next) => {
    try {
        const documents = await dbService.getAllDocuments<IList>(collections.lists);
        res.status(200).send(documents);
    } catch (err) {
        next(err);
    }
}