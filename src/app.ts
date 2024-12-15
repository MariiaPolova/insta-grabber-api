
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { handler as errorHandler } from "./common/appError";

import { initClient } from './service/client';
import v1Routes from './api/v1';
// import { versionMiddleware } from './middleware/apiVersionMiddleware';
const app = express();
const port = 3001;

// Load .env file variables into process.env
dotenv.config();

initClient();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/api', v1Routes);
// app.use('/api', versionMiddleware('1.0.0'), v1Routes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

process.on('unhandledRejection', (reason: string) => {
  // I just caught an unhandled promise rejection,
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error))
    process.exit(1);
});