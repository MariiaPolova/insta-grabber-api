
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { handler as errorHandler } from "./common/appError";

import { initClient } from './service/client';
import v1Routes from './api/v1';
import { BaseError } from './common/BaseError';
import { swaggerUi, swaggerSpec } from './common/swagger';
// import { versionMiddleware } from './middleware/apiVersionMiddleware';
const app = express();
const port = 3001;

// Load .env file variables into process.env
dotenv.config();

initClient();

app.use(express.json())

app.use(cors({
  origin: process.env.CLIENT_URL,
}));

// Serve Swagger UI documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api', v1Routes);
// app.use('/api', versionMiddleware('1.0.0'), v1Routes);

app.listen(port, () => {
  return console.log(`Express is listening at ${process.env.API_URL}:${port}`);
});

app.use(async (err: BaseError | Error, _req: Request, res: Response, next: NextFunction) => {
  if (!errorHandler.isTrustedError(err)) {
    next(err);
  }
  await errorHandler.handleError(err, res);
 });

process.on('unhandledRejection', (reason: string) => {
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  errorHandler.handleError(error);
  // if (!errorHandler.isTrustedError(error))
  //   process.exit(1);
});