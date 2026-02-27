# Users Module

This module handles user management operations including user data and profile management.

## Files

- `user.model.js` - Defines the user data structure
- `user.controller.js` - Contains controller functions for user operations
- `user.routes.js` - Defines API routes for user endpoints
- `README.md` - This documentation file

## Routes

### GET /
Retrieves all users in the system.

**Authentication:** Required (Admin only)

**Responses:**
- `200` - Users retrieved successfully
- `500` - Error fetching users

### GET /:id
Retrieves a specific user by ID.

**Parameters:**
- `id` (path) - User ID

**Authentication:** Required

**Responses:**
- `200` - User retrieved successfully
- `404` - User not found
- `500` - Error fetching user

### PUT /:id
Updates user information.

**Parameters:**
- `id` (path) - User ID

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001"
  }
}
```

**Authentication:** Required

**Responses:**
- `200` - User updated successfully
- `404` - User not found
- `500` - Error updating user

## Data Structure

The user includes:

- **Personal Information**: First name, last name, email, phone number
- **Authentication**: Password (hashed), role (user/admin)
- **Profile**: Address, date of birth, gender, profile image
- **Status**: Active, inactive, or banned

## Features

- User CRUD operations
- Role-based access control
- Profile management
- Address management
- Status management

## Dependencies

- `bcryptjs` - Password hashing
- `jsonwebtoken` - Authentication tokens

## Notes

Password is always excluded from API responses for security. Only admins can access all users list.
