import semver from 'semver';
import { AppError } from '../common/appError';

export const versionMiddleware = (version) =>
    (req, res, next) => {
        const { headers } = req;
        if (headers['x-version'] && semver.gte(headers['x-version'], version)) {
            return next();
        }

        throw new AppError(`Current API version doesn't exist`, true)
    };