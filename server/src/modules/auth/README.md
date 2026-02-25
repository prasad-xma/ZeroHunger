# Auth Module

This module handles authentication functionality including user registration, login, and logout.

## Files

- `auth.controller.js` - Contains authentication controller functions
- `auth.routes.js` - Defines authentication routes
- `README.md` - This documentation file

## Routes

### POST /register
Registers a new user in the system.

### POST /login
Authenticates a user and returns a JWT token.

### POST /logout
Logs out a user by clearing the token cookie.

## Controller Functions

### register(req, res)

Registers a new user in the system.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "role": "string"
}
```

**Functionality:**
- Validates that password and confirmPassword match
- Checks if user already exists by email
- Automatically assigns "admin" role to the first user in the system
- Hashes password before storing
- Creates new user record

**Responses:**
- `201` - User registered successfully
- `400` - Passwords don't match or user already exists
- `500` - Registration failed

### login(req, res)

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Functionality:**
- Validates email and password are provided
- Finds user by email
- Compares provided password with stored hash
- Generates JWT token with user ID and role

**Responses:**
- `200` - Login successful with token
- `400` - Invalid credentials or missing fields
- `500` - Login failed

### logout(req, res)

Logs out a user by clearing the token cookie.

**Headers:**
- `Authorization: Bearer <token>`

**Functionality:**
- Extracts and verifies token from Authorization header
- Clears the token cookie
- Returns success message


## Dependencies

- `../users/user.model` - User model for database operations
- `../../utils/authUtils/passwordUtils` - Password hashing and comparison utilities
- `../../utils/authUtils/tokenUtils` - JWT token generation and verification utilities

## Security Features

- Password hashing before storage
- JWT token-based authentication
- Automatic admin role assignment for first user
- Input validation for required fields
- Secure password comparison
