import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyGoogleToken } from './googleAuth.js';
import { Timestamp } from 'firebase-admin/firestore';
import userActions from '../database/collections/users.js';
import { IUser } from '../database/interfaces/users.js';
import { collections } from '../database/constants.js';
import { generateFirebaseId } from '../database/database.service.js';

export interface AuthenticatedRequest extends Request {
    user: IUser;
}


/**
 * Middleware to verify authentication token
 * For NextAuth.js, we'll verify the session token or JWT
 * After verification, fetches or creates user in database
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
      return;
    }

    const decoded = await verifyGoogleToken(authHeader.substring(7));

    if (!decoded) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Unauthorized',
        message: 'Token verification failed'
      });
      return;
    }

    // Check if user exists in database, create if not
    let user = await userActions.getAuthOne({ key: 'googleId', value: decoded.sub! });

    if (!user) {
      // Create new user
      const newUser: Omit<IUser, 'id'> = {
        googleId: decoded.sub!,
        email: decoded.email!,
        name: decoded.name,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      };

      const userId = generateFirebaseId(collections.users);
      const createdUser = await userActions.createOne(userId, newUser as IUser);
      if (createdUser) {
        user = { ...newUser, id: createdUser.id } as IUser;
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: 'Internal error',
          message: 'Failed to create user'
        });
        return;
      }
    } else {
      // Update last access time
      await userActions.updateOne(user.id!, user.id!, {
        ...user,
        updated_at: Timestamp.now()
      } as IUser);
    }

    // Attach full user info to request
    (req as AuthenticatedRequest).user = user;

    next();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

