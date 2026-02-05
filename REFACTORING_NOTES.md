# User-Based Authentication and Post Fetching Refactoring

## Overview

The application has been refactored to implement user-based authentication with database persistence. After Google OAuth authentication, user information is stored in a database collection, and posts are fetched based on the user's associated Instagram account.

## Changes Made

### 1. Database Layer

#### New User Collection
- **Location**: `/workspace/insta-grabber-api/src/database/`
- **Files**:
  - `interfaces/users.ts` - User interface definition
  - `collections/users.ts` - User collection layer
  - `constants.ts` - Added `users` to collections enum

#### User Interface (`IUser`)
```typescript
{
  id?: string;
  googleId: string;        // Google OAuth user ID
  email: string;
  name?: string;
  accountId?: string;      // Reference to Instagram account
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### 2. Authentication Middleware

**File**: `src/middleware/authMiddleware.ts`

The auth middleware now:
1. Verifies the Google OAuth token
2. Checks if user exists in the database (by `googleId`)
3. Creates a new user record if not found
4. Updates the user's `updated_at` timestamp on each request
5. Attaches the full user object to `req.user`

### 3. API Endpoints

#### Updated Endpoints

**GET `/api/accounts`**
- Now returns only the account associated with the authenticated user
- Returns empty array if user has no linked account

**GET `/api/:accountUsername/posts`**
- Validates that the user has an associated account
- Verifies the requested account matches the user's account
- Returns 403 Forbidden if user tries to access another account's posts

#### New Endpoints

**GET `/api/user/me`**
- Returns the current authenticated user's information
- Requires: Bearer token in Authorization header

**POST `/api/user/link-account`**
- Links an Instagram account to the current user
- Request body: `{ "accountId": "account-id" }`
- Validates that the account exists before linking

### 4. Protected Routes

The following routes now require authentication via `authMiddleware`:
- `GET /api/accounts`
- `GET /api/:accountUsername/posts`
- `GET /api/lists`
- `POST /api/lists`
- `GET /api/user/me`
- `POST /api/user/link-account`

## Authentication Flow

```
1. User signs in with Google OAuth (frontend)
   ↓
2. Frontend receives JWT token
   ↓
3. Frontend includes token in Authorization header: "Bearer {token}"
   ↓
4. Backend authMiddleware verifies token
   ↓
5. Backend checks/creates user in database
   ↓
6. User object attached to request
   ↓
7. Endpoints filter data based on user's accountId
```

## Database Schema

### Collections

1. **users** (new)
   - Stores Google OAuth authenticated users
   - Links users to their Instagram accounts

2. **source_accounts**
   - Stores Instagram account information
   - Referenced by users via `accountId`

3. **posts**
   - Stores Instagram posts
   - Filtered by `account_username`

4. **lists**
   - Stores user-created lists

## Usage Examples

### 1. Get Current User
```bash
curl -H "Authorization: Bearer {google-token}" \
  http://localhost:3001/api/user/me
```

### 2. Link Instagram Account to User
```bash
curl -X POST \
  -H "Authorization: Bearer {google-token}" \
  -H "Content-Type: application/json" \
  -d '{"accountId": "account-id-here"}' \
  http://localhost:3001/api/user/link-account
```

### 3. Get User's Account Posts
```bash
curl -H "Authorization: Bearer {google-token}" \
  http://localhost:3001/api/{username}/posts
```

## Security Improvements

1. **User Isolation**: Users can only access their own account's posts
2. **Database-Backed Auth**: User information persisted beyond session
3. **Account Ownership**: Validates account ownership before returning data
4. **Protected Endpoints**: All sensitive routes require authentication

## Migration Notes

### For Existing Users
- Users will be automatically created in the database on first login
- Existing accounts need to be linked using the `/api/user/link-account` endpoint
- Frontend should guide users to link their Instagram account after first login

### Database Migration
No migration script needed - users are created on-the-fly during authentication.

## Next Steps

1. **Frontend Integration**:
   - Update frontend to call `/api/user/link-account` after account creation
   - Show account linking UI for users without linked accounts
   - Handle 403 errors gracefully when users try to access unlinked accounts

2. **Enhanced Features**:
   - Add ability for users to link multiple Instagram accounts
   - Implement account switching functionality
   - Add user profile management endpoints

3. **Security**:
   - Add rate limiting to authentication endpoints
   - Implement refresh token mechanism
   - Add audit logging for user actions
