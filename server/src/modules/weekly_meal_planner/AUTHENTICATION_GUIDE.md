# 🍽️ Weekly Meal Planner API - Authentication Integration

## 🔐 **Authentication Flow**

### **1. User Registration & Login**
```http
POST /api/auth/register
POST /api/auth/login
```

### **2. Get JWT Token**
After successful login, you receive:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1234567890abcdef12345",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### **3. Use Token for Protected Routes**
Add Authorization header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛡️ **Protected Weekly Meal Planner Endpoints**

### **Create Weekly Plan**
```http
POST /api/meal-plan
Authorization: Bearer {token}
Content-Type: application/json

{
  "weekStartDate": "2024-01-15T00:00:00.000Z",
  "goal": "Weight Loss"
}
```
**Note:** `userId` is automatically extracted from JWT token

### **Get User Plans**
```http
GET /api/meal-plan/user/{userId}
Authorization: Bearer {token}
```
**Security:** Users can only access their own data (unless admin)

### **Add Food to Meal**
```http
PUT /api/meal-plan/{planId}/add-food
Authorization: Bearer {token}
Content-Type: application/json

{
  "day": "Monday",
  "mealType": "breakfast",
  "name": "Oatmeal",
  "grams": 150
}
```

---

## 📊 **Protected Progress Tracking Endpoints**

### **Save Progress**
```http
POST /api/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "weekStartDate": "2024-01-15T00:00:00.000Z",
  "weight": 70.5
}
```
**Note:** `userId` automatically extracted from JWT

### **Get Progress History**
```http
GET /api/progress/history/{userId}
Authorization: Bearer {token}
```

### **Get AI Prediction**
```http
GET /api/progress/prediction/{userId}/Weight%20Loss
Authorization: Bearer {token}
```

---

## 🔑 **Role-Based Access Control**

### **User Roles:**
- `user` - Can access own data only
- `admin` - Can access all data

### **Admin-Only Endpoints:**
```http
DELETE /api/meal-plan/admin/all
DELETE /api/progress/admin/all
```

---

## 🚫 **Error Responses**

### **Unauthorized (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### **Forbidden (403):**
```json
{
  "success": false,
  "message": "Forbidden - Cannot access other users data"
}
```

---

## 🧪 **Testing with Postman**

### **Setup:**
1. **Login first** to get token
2. **Set environment variable:** `{{token}}`
3. **Add Authorization header** to all requests

### **Test Sequence:**
```bash
# 1. Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# 2. Create Plan (with token)
POST /api/meal-plan
Authorization: Bearer {{token}}

# 3. Add Food (with token)
PUT /api/meal-plan/{planId}/add-food
Authorization: Bearer {{token}}

# 4. Save Progress (with token)
POST /api/progress
Authorization: Bearer {{token}}
```

---

## 🔄 **Updated Request/Response Formats**

### **Before (Manual userId):**
```json
{
  "userId": "64f1234567890abcdef12345",
  "weekStartDate": "2024-01-15T00:00:00.000Z",
  "goal": "Weight Loss"
}
```

### **After (Automatic userId):**
```json
{
  "weekStartDate": "2024-01-15T00:00:00.000Z",
  "goal": "Weight Loss"
}
```

---

## 🛠️ **Security Features Implemented**

✅ **JWT Authentication** - Token-based auth  
✅ **Automatic User ID Extraction** - From JWT token  
✅ **Role-Based Access Control** - User vs Admin permissions  
✅ **Data Isolation** - Users can only access own data  
✅ **Protected Routes** - All endpoints require authentication  
✅ **Token Validation** - Middleware verifies token validity  
✅ **User Verification** - Checks user exists in database  

Your weekly meal planner is now fully integrated with the existing authentication system!
