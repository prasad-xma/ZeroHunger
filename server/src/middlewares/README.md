# Middlewares

This directory contains middleware functions for authentication and authorization.

## Files

- `auth.middleware.js` - Authentication middleware for JWT token verification
- `role.middleware.js` - Role-based authorization middleware
- `README.md` - This documentation file

## Auth Middleware

### protect(req, res, next)
Verifies JWT token and sets user object in request.

**Usage:**
```javascript
router.get('/profile', protect, getUserProfile);
```

**Headers Required:**
- `Authorization: Bearer <token>`

**Functionality:**
- Extracts token from Authorization header
- Verifies token using JWT_SECRET
- Finds user by ID from token payload
- Sets req.user with user data (excluding password)
- Supports both {id} and {userId} token formats

**Responses:**
- Passes to next() on success
- Returns 401 Unauthorized on failure

## Role Middleware

### authorizedRole(...roles)
Creates middleware to check if user has required role.

**Usage:**
```javascript
router.get('/admin', protect, authorizedRole('admin'), adminOnlyRoute);
router.get('/moderator', protect, authorizedRole('admin', 'moderator'), moderatorRoute);
```

**Parameters:**
- `...roles` - Array of allowed roles

**Functionality:**
- Checks if req.user.role is in allowed roles
- Returns 401 Unauthorized if role not allowed

**Responses:**
- Passes to next() on success
- Returns 401 Unauthorized on role mismatch

## Usage Pattern

Most protected routes follow this pattern:
```javascript
router.get('/protected-route', protect, authorizedRole('user'), controllerFunction);
```

## Dependencies

- `jsonwebtoken` - JWT token verification
- `../modules/users/user.model` - User model for authentication

## Notes

- All middleware functions are asynchronous
- User passwords are automatically excluded from responses
- Token verification uses environment variable JWT_SECRET
