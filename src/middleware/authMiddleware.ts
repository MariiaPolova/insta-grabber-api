import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyGoogleToken } from './googleAuth.js';

/**
 * Middleware to verify authentication token
 * For NextAuth.js, we'll verify the session token or JWT
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

    // Attach user info to request
    (req as any).user = {
      id: decoded?.sub,
      email: decoded?.email,
      name: decoded?.name,
    };

    next();
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

