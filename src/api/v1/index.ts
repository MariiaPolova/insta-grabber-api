import { Router } from 'express';
import { getAccounts } from './accounts/controllers/getAccounts';
import { getAccountPosts } from './posts/controllers/getAccountPosts';
import { populateAccountPosts } from './posts/controllers/populateAccountPosts';

const v1Routes = Router();

v1Routes.get('/accounts', getAccounts);

v1Routes.get('/:accountUsername/posts', getAccountPosts);

v1Routes.post('/populate/:accountUsername/posts', populateAccountPosts);

export default v1Routes;