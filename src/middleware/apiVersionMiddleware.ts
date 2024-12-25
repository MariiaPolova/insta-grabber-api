import semver from 'semver';
import { APIError } from '../common/BaseError';
import { StatusCodes } from 'http-status-codes';

export const versionMiddleware = (version) =>
    (req, res, next) => {
        const { headers } = req;
        if (headers['x-version'] && semver.gte(headers['x-version'], version)) {
            return next();
        }

        throw new APIError(`Current API version doesn't exist`, StatusCodes.INTERNAL_SERVER_ERROR)
    };