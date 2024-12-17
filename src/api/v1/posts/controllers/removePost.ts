import * as dbService from "../../../../database/database.service";
import { collections } from "../../../../database/constants";
import { AppError } from "../../../../common/appError";


export const removePost = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        await dbService.removeDocumentById(collections.posts, id);

        res.sendStatus(200);
    } catch (err) {
        throw new AppError(err, false);
    }
}