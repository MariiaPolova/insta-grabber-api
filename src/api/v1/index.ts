import { Router } from 'express';
import { getAccounts } from './accounts/controllers/getAccounts';
import { createAccount } from './accounts/controllers/createAccount';
import { getAccountPosts } from './posts/controllers/getAccountPosts';
import { populateAccountPosts } from './posts/controllers/populateAccountPosts';
import { getAccount } from './accounts/controllers/getSingleAccount';
import { removePost } from './posts/controllers/removePost';
import { addPostToList } from './lists/controllers/addPostToList';
import { removePostFromList } from './lists/controllers/removePostFromList';
import { getLists } from './lists/controllers/getLists';
import { getListPosts } from './lists/controllers/getListPosts';
import { createNewList } from './lists/controllers/createList';

const v1Routes = Router();

v1Routes.get('/accounts', getAccounts);

v1Routes.post('/accounts', createAccount);

v1Routes.get('/accounts/:username', getAccount);

v1Routes.get('/:accountUsername/posts', getAccountPosts);

v1Routes.post('/populate/:accountUsername/posts', populateAccountPosts);

v1Routes.delete('/posts/:id', removePost);

v1Routes.post('/lists', createNewList);

v1Routes.put('/add/:postId/toList/:listId', addPostToList);

v1Routes.put('/remove/:postId/fromList/:listId', removePostFromList);

v1Routes.get('/lists', getLists);

v1Routes.get('/list/:listId', getListPosts);


export default v1Routes;