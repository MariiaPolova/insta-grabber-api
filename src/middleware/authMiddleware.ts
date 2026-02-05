import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyGoogleToken } from './googleAuth.js';
import { Timestamp } from 'firebase-admin/firestore';
import userActions from '../database/collections/users.js';
import { IUser } from '../database/interfaces/users.js';

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
        message: 'Invalid token'
      });
      return;
    }

    // Check if user exists in database, create if not
    let user = await userActions.getOne({ key: 'googleId', value: decoded.sub! });

    if (!user) {
      // Create new user
      const newUser: Omit<IUser, 'id'> = {
        googleId: decoded.sub!,
        email: decoded.email!,
        name: decoded.name,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      };

      const createdUser = await userActions.createOne(newUser as IUser);
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
      await userActions.updateOne(user.id!, {
        ...user,
        updated_at: Timestamp.now()
      } as IUser);
    }

    // Attach full user info to request
    (req as any).user = user;

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

