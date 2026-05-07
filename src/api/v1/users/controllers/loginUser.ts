
import * as admin from "firebase-admin";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from 'express';
import userActions from '../../../../database/collections/users.js';
import { IUser } from "../../../../database/interfaces/users.js";
import { AuthenticatedRequest } from "../../../../middleware/authMiddleware.js";

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
            // Get authenticated user from middleware
        const user = (req as AuthenticatedRequest).user as IUser;
        const existingAccount = await userActions.getOne(user.id!);
        
        if (existingAccount) {
            res.status(StatusCodes.OK).send();
            return;
        }

        await userActions.createOne(user.id!, { 
            id: user.id!,
            email: user.email,
            name: user.name,
            created_at: admin.firestore.Timestamp.now(),
            googleId: user.googleId,
        });

        res.status(StatusCodes.OK).send();
    } catch (e) {
        next(e);
    }
}