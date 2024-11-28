
import dotenv from 'dotenv';

import * as dbService from "./database/service.js";
import { collections } from "./database/constants.js";
import { handler as errorHandler } from "./common/appError";

import express from 'express';
import { initClient } from './service/client';
import { createAccountPosts } from './api/posts/createPosts';
const app = express();
const port = 3000;

// Load .env file variables into process.env
dotenv.config();

initClient();

app.get('/accounts', async (req, res) => {
  const documents = await dbService.getAllDocuments(collections.accounts);
  res.send(documents);
});


app.get('/:accountUsername/posts', async (req, res) => {
  const { params } = req;
  const { accountUsername } = params;
  // const accountPosts = await getAccountPostsByUsername(accountUsername);
  const documents = await dbService.getAllDocuments(collections.posts, {account_username: accountUsername});
  res.send(documents);
});

app.post('/populate/:accountUsername/posts', async (req, res) => {
  const { params, query } = req;
  const { accountUsername } = params;
  const { limit } = query; 

  await createAccountPosts(accountUsername, parseInt(limit.toString(), 10));
  res.sendStatus(200);
});

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