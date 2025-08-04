import semver from 'semver';
import { StatusCodes } from 'http-status-codes';
import { NextFunction } from 'express';
import { APIError } from '../common/BaseError.js';

export const versionMiddleware = (version: string) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { headers } = req;
        const headerVersion = headers.get('x-version');
        if (headerVersion && semver.gte(headerVersion, version)) {
            return next();
        }

        throw new APIError(`Current API version doesn't exist`, StatusCodes.INTERNAL_SERVER_ERROR)
    };