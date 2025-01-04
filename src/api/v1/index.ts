import { Router } from 'express';
import { getAccounts } from './accounts/controllers/getAccounts';
import { createAccount, createAccountSchema } from './accounts/controllers/createAccount';
import { getAccountPosts } from './posts/controllers/getAccountPosts';
import { populateAccountPosts, populateAccountPostsSchema } from './posts/controllers/populateAccountPosts';
import { getAccount } from './accounts/controllers/getSingleAccount';
import { removePost, removePostSchema } from './posts/controllers/removePost';
import { addPostToList } from './lists/controllers/addPostToList';
import { removePostFromList } from './lists/controllers/removePostFromList';
import { getLists } from './lists/controllers/getLists';
import { getListPosts } from './lists/controllers/getListPosts';
import { createNewList } from './lists/controllers/createList';
import validate from '../../common/apiValidation';

const v1Routes = Router();


v1Routes.get('/accounts', getAccounts);

/**
 * @openapi
 * '/api/accounts':
 *  post:
 *     tags:
 *     - Account Controller
 *     summary: Add a new user account
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *            properties:
 *              username:
 *                type: string
 *                default: johndoe 
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Account already exists
 *      500:
 *        description: Server Error
 */
v1Routes.post('/accounts', validate(createAccountSchema), createAccount);

v1Routes.get('/accounts/:username', getAccount);

v1Routes.get('/:accountUsername/posts', getAccountPosts);

/**
 * @openapi
 * '/api/populate/{accountUsername}/posts':
 *  post:
 *     tags:
 *     - Account Controller
 *     summary: Populate account posts
 *     parameters:
 *       - name: accountUsername
 *         in: path
 *         description: The target account name for population
 *         required: true
 *         schema:
 *           type: string
 *           default: johndoe
 *       - name: limit
 *         in: query
 *         description: The amount of posts to be populated
 *         required: true
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
v1Routes.post('/populate/:accountUsername/posts', validate(populateAccountPostsSchema), populateAccountPosts);

v1Routes.delete('/posts/:id', validate(removePostSchema), removePost);

v1Routes.post('/lists', createNewList);

v1Routes.put('/add/:postId/toList/:listId', addPostToList);

v1Routes.put('/remove/:postId/fromList/:listId', removePostFromList);

v1Routes.get('/lists', getLists);

v1Routes.get('/list/:listId', getListPosts);


export default v1Routes;