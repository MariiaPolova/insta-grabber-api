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
import { createNewList, createListSchema } from './lists/controllers/createList';
import validate from '../../common/apiValidation';
import { getOutsidePosts } from './posts/controllers/fetchOutsidePost';
import { getSinglePost } from './posts/controllers/getSinglePost';

const v1Routes = Router();

/**
 * @openapi
 * '/api/accounts':
 *  get:
 *     tags:
 *     - Account Controller
 *     summary: Get accounts
 *     responses:
 *      200:
 *        description: OK
 *      500:
 *        description: Server Error
 */
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

/**
 * @openapi
 * '/api/accounts/{username}':
 *  get:
 *     tags:
 *     - Account Controller
 *     summary: Get account by username
  *     parameters:
 *       - name: username
 *         in: path
 *         description: The target account name
 *         required: true
 *         schema:
 *           type: string
 *           default: johndoe
 *     responses:
 *      200:
 *        description: OK
 *      500:
 *        description: Server Error
 */
v1Routes.get('/accounts/:username', getAccount);

/**
 * @openapi
 * '/api/{accountUsername}/posts':
 *  get:
 *     tags:
 *     - Post Controller
 *     summary: Get account posts
 *     parameters:
 *       - name: accountUsername
 *         in: path
 *         description: The target account name
 *         required: true
 *         schema:
 *           type: string
 *           default: johndoe
 *     responses:
 *      200:
 *        description: OK
 *      500:
 *        description: Server Error
 */
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

/**
 * @openapi
 * '/api/posts/{id}':
 *  delete:
 *     tags:
 *     - Post Controller
 *     summary: Remove post
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The post id to remove
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
v1Routes.delete('/posts/:id', validate(removePostSchema), removePost);

/**
 * @openapi
 * '/api/lists':
 *  post:
 *     tags:
 *     - List Controller
 *     summary: Create new list
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                default: testlist 
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
v1Routes.post('/lists', validate(createListSchema), createNewList);

/**
 * @openapi
 * '/api/add/{postId}/toList/{listId}':
 *  put:
 *     tags:
 *     - List Controller
 *     summary: Add post to list
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: The post id to be added
 *         required: true
 *       - name: listId
 *         in: path
 *         description: The target list id
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
v1Routes.put('/add/:postId/toList/:listId', addPostToList);

/**
 * @openapi
 * '/api/remove/{postId}/fromList/{listId}':
 *  put:
 *     tags:
 *     - List Controller
 *     summary: Remove post from list
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: The post id to be removed
 *         required: true
 *       - name: listId
 *         in: path
 *         description: The target list id
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
v1Routes.put('/remove/:postId/fromList/:listId', removePostFromList);

/**
 * @openapi
 * '/api/lists':
 *  get:
 *     tags:
 *     - List Controller
 *     summary: Get all lists
 *     responses:
 *      200:
 *        description: OK
 *      500:
 *        description: Server Error
 */
v1Routes.get('/lists', getLists);

/**
 * @openapi
 * '/api/list/{listId}':
 *  get:
 *     tags:
 *     - List Controller
 *     summary: Get all list posts
 *     parameters:
 *       - name: listId
 *         in: path
 *         description: The list ID
 *         required: true
 *         schema:
 *           type: string
 *           default: johndoe
 *     responses:
 *      200:
 *        description: OK
 *      500:
 *        description: Server Error
 */
v1Routes.get('/list/:listId', getListPosts);

v1Routes.get('/grab', getOutsidePosts);
v1Routes.get('/posts/:id', getSinglePost);


export default v1Routes;