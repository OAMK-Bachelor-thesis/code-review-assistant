# API Endpoints Documentation
## AI-Enhanced Code Review Assistant

**Base URL:** `http://localhost:5000/api` (development)  
**Production URL:** To be determined after deployment

**Content-Type:** `application/json`  
**Authentication:** JWT Bearer Token (Supabase Auth)

---

## **Table of Contents**

1. [Authentication Endpoints](#authentication-endpoints)
2. [Code Review Endpoints](#code-review-endpoints)
3. [Feedback Endpoints](#feedback-endpoints)
4. [Error Handling](#error-handling)
5. [Status Codes](#http-status-codes)
6. [Authentication](#authentication)
7. [Rate Limiting](#rate-limiting)

---

## **Authentication Endpoints**

### **1. User Registration**

**Endpoint:** `POST /auth/register`

**Description:** Register a new user account

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe"
}
```

**Response (Success - 201):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2025-11-18T10:30:00Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh-token-string",
    "expires_in": 3600,
    "token_type": "bearer"
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Email already registered"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "username": "johndoe"
  }'
```

---

### **2. User Login**

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh-token-string",
    "expires_in": 3600,
    "token_type": "bearer"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid email or password"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

### **3. Get Current User**

**Endpoint:** `GET /auth/user`

**Description:** Get current authenticated user information

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "id": "uuid-string",
  "username": "johndoe",
  "email": "user@example.com",
  "created_at": "2025-11-18T10:30:00Z"
}
```

**Response (Error - 401):**
```json
{
  "error": "Unauthorized - Invalid or missing token"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/user \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

---

### **4. User Logout**

**Endpoint:** `POST /auth/logout`

**Description:** Logout user and invalidate session

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

---

## **Code Review Endpoints**

### **1. Submit Code for Review**

**Endpoint:** `POST /reviews`

**Description:** Submit code for AI analysis and suggestions

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Login Component Review",
  "code_snippet": "function login(email, password) {\n  const user = db.find({email});\n  if (user && user.password === password) {\n    return user;\n  }\n}"
}
```

**Response (Success - 201):**
```json
{
  "id": "review-uuid",
  "user_id": "user-uuid",
  "title": "Login Component Review",
  "code_snippet": "function login(email, password) { ... }",
  "ai_suggestions": {
    "issues": [
      {
        "severity": "high",
        "category": "security",
        "line": 3,
        "issue": "Password stored in plaintext",
        "suggestion": "Use bcrypt or similar for password hashing",
        "example": "const hashedPassword = await bcrypt.hash(password, 10);"
      },
      {
        "severity": "medium",
        "category": "best-practice",
        "line": 2,
        "issue": "No error handling",
        "suggestion": "Add try-catch block",
        "example": "try { ... } catch (error) { ... }"
      }
    ],
    "summary": "2 security issues, 1 best practice recommendation",
    "score": "65/100"
  },
  "severity_level": "high",
  "created_at": "2025-11-18T11:00:00Z",
  "updated_at": "2025-11-18T11:00:00Z"
}
```

**Response (Error - 400):**
```json
{
  "error": "Code snippet is required"
}
```

**Response (Error - 401):**
```json
{
  "error": "Unauthorized"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login Component Review",
    "code_snippet": "function login(email, password) { ... }"
  }'
```

---

### **2. Get User's Review History**

**Endpoint:** `GET /reviews`

**Description:** Get all code reviews submitted by the authenticated user

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Query Parameters:**
```
?limit=10          # Default: 10, Max: 100
?offset=0          # Default: 0 (for pagination)
?sort=created_at   # Default: created_at (descending)
```

**Response (Success - 200):**
```json
[
  {
    "id": "review-uuid-1",
    "user_id": "user-uuid",
    "title": "Login Component Review",
    "code_snippet": "function login(email, password) { ... }",
    "ai_suggestions": { ... },
    "severity_level": "high",
    "created_at": "2025-11-18T11:00:00Z",
    "updated_at": "2025-11-18T11:00:00Z"
  },
  {
    "id": "review-uuid-2",
    "user_id": "user-uuid",
    "title": "API Route Review",
    "code_snippet": "app.get('/users/:id', (req, res) => { ... })",
    "ai_suggestions": { ... },
    "severity_level": "medium",
    "created_at": "2025-11-17T10:30:00Z",
    "updated_at": "2025-11-17T10:30:00Z"
  }
]
```

**Response (Error - 401):**
```json
{
  "error": "Unauthorized"
}
```

**Example cURL:**
```bash
curl -X GET "http://localhost:5000/api/reviews?limit=10&offset=0" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

---

### **3. Get Specific Review**

**Endpoint:** `GET /reviews/:id`

**Description:** Get detailed information about a specific code review

**Path Parameters:**
```
:id - Review ID (UUID)
```

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "id": "review-uuid",
  "user_id": "user-uuid",
  "title": "Login Component Review",
  "code_snippet": "function login(email, password) { ... }",
  "ai_suggestions": {
    "issues": [
      {
        "severity": "high",
        "category": "security",
        "line": 3,
        "issue": "Password stored in plaintext",
        "suggestion": "Use bcrypt or similar for password hashing",
        "example": "const hashedPassword = await bcrypt.hash(password, 10);"
      }
    ],
    "summary": "2 security issues found",
    "score": "65/100"
  },
  "severity_level": "high",
  "created_at": "2025-11-18T11:00:00Z",
  "updated_at": "2025-11-18T11:00:00Z"
}
```

**Response (Error - 404):**
```json
{
  "error": "Review not found"
}
```

**Response (Error - 401):**
```json
{
  "error": "Unauthorized"
}
```

**Response (Error - 403):**
```json
{
  "error": "Forbidden - This review belongs to another user"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:5000/api/reviews/review-uuid \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

---

### **4. Delete Review**

**Endpoint:** `DELETE /reviews/:id`

**Description:** Delete a code review

**Path Parameters:**
```
:id - Review ID (UUID)
```

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "message": "Review deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "error": "Review not found"
}
```

**Response (Error - 403):**
```json
{
  "error": "Forbidden - Cannot delete review"
}
```

**Example cURL:**
```bash
curl -X DELETE http://localhost:5000/api/reviews/review-uuid \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

---

## **Feedback Endpoints**

### **1. Submit Feedback on Review**

**Endpoint:** `POST /reviews/:id/feedback`

**Description:** Submit feedback and ratings on AI suggestions (for research purposes)

**Path Parameters:**
```
:id - Review ID (UUID)
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "accuracy_rating": 8,
  "helpfulness_rating": 9,
  "trust_rating": 7,
  "time_spent_minutes": 5,
  "developer_feedback": "Very helpful suggestions. Some were obvious, but the security issues were spot-on."
}
```

**Response (Success - 201):**
```json
{
  "id": "feedback-uuid",
  "review_id": "review-uuid",
  "accuracy_rating": 8,
  "helpfulness_rating": 9,
  "trust_rating": 7,
  "time_spent_minutes": 5,
  "developer_feedback": "Very helpful suggestions...",
  "created_at": "2025-11-18T11:30:00Z"
}
```

**Response (Error - 400):**
```json
{
  "error": "Invalid rating - must be between 1 and 10"
}
```

**Response (Error - 404):**
```json
{
  "error": "Review not found"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/reviews/review-uuid/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "accuracy_rating": 8,
    "helpfulness_rating": 9,
    "trust_rating": 7,
    "time_spent_minutes": 5,
    "developer_feedback": "Very helpful suggestions..."
  }'
```

---

### **2. Get Feedback for Review**

**Endpoint:** `GET /reviews/:id/feedback`

**Description:** Get all feedback submitted for a specific review

**Path Parameters:**
```
:id - Review ID (UUID)
```

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (Success - 200):**
```json
[
  {
    "id": "feedback-uuid-1",
    "review_id": "review-uuid",
    "accuracy_rating": 8,
    "helpfulness_rating": 9,
    "trust_rating": 7,
    "time_spent_minutes": 5,
    "developer_feedback": "Very helpful suggestions...",
    "created_at": "2025-11-18T11:30:00Z"
  },
  {
    "id": "feedback-uuid-2",
    "review_id": "review-uuid",
    "accuracy_rating": 7,
    "helpfulness_rating": 8,
    "trust_rating": 6,
    "time_spent_minutes": 8,
    "developer_feedback": "Good points, but some were subjective...",
    "created_at": "2025-11-18T12:00:00Z"
  }
]
```

**Response (Error - 404):**
```json
{
  "error": "Review not found"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:5000/api/reviews/review-uuid/feedback \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json"
```

---

## **Error Handling**

### **Standard Error Response Format**

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional context if applicable"
  }
}
```

### **Common Error Codes**

```
INVALID_REQUEST      - Malformed request
UNAUTHORIZED         - Missing or invalid authentication
FORBIDDEN            - User doesn't have permission
NOT_FOUND            - Resource doesn't exist
CONFLICT             - Resource already exists
UNPROCESSABLE_ENTITY - Request body validation failed
RATE_LIMIT_EXCEEDED  - Too many requests
SERVER_ERROR         - Internal server error
```

---

## **HTTP Status Codes**

| Code | Meaning | Typical Cause |
|------|---------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Service temporarily down |

---

## **Authentication**

### **Bearer Token Format**

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {access_token}
```

**Token Structure:**
- Type: JWT (JSON Web Token)
- Issued by: Supabase Auth
- Expires in: 3600 seconds (1 hour)
- Refresh token available for renewal

### **How to Get a Token**

1. Call `POST /auth/register` or `POST /auth/login`
2. Store the `access_token` from the response
3. Include it in the `Authorization` header for subsequent requests
4. When token expires, use `refresh_token` to get a new one

### **Token Renewal**

When your token expires:
1. Use the refresh_token to get a new access_token
2. OR: Make a new login request

---

## **Rate Limiting**

**Current Limits:**
- 100 requests per minute per user
- 1000 requests per hour per user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1700000000
```

**When Limited (429):**
```json
{
  "error": "Too many requests",
  "retry_after": 60
}
```

---

## **Example Complete Workflow**

### **1. Register User**
```bash
POST /auth/register
{
  "email": "dev@example.com",
  "password": "secure123",
  "username": "developer"
}
```

### **2. Login**
```bash
POST /auth/login
{
  "email": "dev@example.com",
  "password": "secure123"
}
# Response includes: access_token
```

### **3. Submit Code for Review**
```bash
POST /reviews
Authorization: Bearer {access_token}
{
  "title": "Function Review",
  "code_snippet": "function foo() { ... }"
}
# Response includes: review_id, ai_suggestions
```

### **4. Get Review Details**
```bash
GET /reviews/{review_id}
Authorization: Bearer {access_token}
# Response includes: Full review with AI suggestions
```

### **5. Submit Feedback**
```bash
POST /reviews/{review_id}/feedback
{
  "accuracy_rating": 8,
  "helpfulness_rating": 9,
  "trust_rating": 7,
  "time_spent_minutes": 5,
  "developer_feedback": "Great suggestions!"
}
```

---

## **Database Integration**

### **Supabase Row Level Security**

All endpoints respect Row Level Security policies:

- Users can only access their own reviews
- Users can only delete their own reviews
- Anyone can submit feedback (for research)
- Users can view feedback on their reviews

---

## **Future Enhancements**

Planned additions:
- [ ] Pagination for large result sets
- [ ] Advanced filtering and search
- [ ] Batch code review submission
- [ ] Webhook notifications
- [ ] Export review history
- [ ] Code snippet versioning
- [ ] Comparison between reviews

---

## **Support & Questions**

For API questions or issues:
- Check the error response for details
- Review the example cURL commands
- Refer to the database schema for data structure

**Last Updated:** November 2025  
**API Version:** 1.0

---