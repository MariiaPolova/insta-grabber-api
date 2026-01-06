import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

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

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Decode the JWT token (NextAuth uses JWT by default)
    // You can verify the token signature here if needed
    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    // Attach user info to request
    (req as any).user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Optional middleware - allows both authenticated and unauthenticated requests
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      (req as any).user = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
      };
    }

    next();
  } catch (error) {
    // Continue without user info if token is invalid
    next();
  }
};
