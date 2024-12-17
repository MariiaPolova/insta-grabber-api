import { Router } from 'express';
import { getAccounts } from './accounts/controllers/getAccounts';
import { createAccount } from './accounts/controllers/createAccount';
import { getAccountPosts } from './posts/controllers/getAccountPosts';
import { populateAccountPosts } from './posts/controllers/populateAccountPosts';
import { getAccount } from './accounts/controllers/getSingleAccount';
import { removePost } from './posts/controllers/removePost';

const v1Routes = Router();

v1Routes.get('/accounts', getAccounts);

v1Routes.post('/accounts', createAccount);

v1Routes.get('/accounts/:username', getAccount);

v1Routes.get('/:accountUsername/posts', getAccountPosts);

v1Routes.post('/populate/:accountUsername/posts', populateAccountPosts);

v1Routes.delete('/posts/:id', removePost);

export default v1Routes;