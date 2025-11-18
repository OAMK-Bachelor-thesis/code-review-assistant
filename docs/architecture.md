# System Architecture
## AI-Enhanced Code Review Assistant

---

## **Architecture Overview**

The application follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│              (React Frontend - Web Browser)              │
│  ┌─────────────────────────────────────────────────┐    │
│  │ • Code Editor Component                         │    │
│  │ • Results Display Component                     │    │
│  │ • User Dashboard                                │    │
│  │ • Navigation & UI                               │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     │ (JSON)
┌────────────────────▼────────────────────────────────────┐
│                    APPLICATION LAYER                    │
│           (Node.js/Express Backend Server)              │
│  ┌─────────────────────────────────────────────────┐    │
│  │ • Authentication Routes (Supabase Auth)        │    │
│  │ • Code Review Endpoints                        │    │
│  │ • Feedback Collection Endpoints                │    │
│  │ • Data Validation & Error Handling             │    │
│  │ • OpenAI API Integration                       │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │ SDK Calls
                     │ (Supabase Client)
┌────────────────────▼────────────────────────────────────┐
│                    DATA LAYER                           │
│                 (Supabase Backend)                       │
│  ┌──────────────────┬──────────────────────────────┐    │
│  │  PostgreSQL DB   │  Supabase Auth              │    │
│  │  • users         │  • User registration        │    │
│  │  • reviews       │  • Login/Logout             │    │
│  │  • feedback      │  • JWT token management     │    │
│  │  • error_cats    │  • Session management       │    │
│  └──────────────────┴──────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Row Level Security (RLS)                      │    │
│  │  • Users only see their own data               │    │
│  │  • Feedback accessible for research            │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              EXTERNAL SERVICES                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ OpenAI API                                      │    │
│  │ • Code analysis & suggestions                  │    │
│  │ • Natural language processing                  │    │
│  │ • Issue categorization                         │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## **Component Details**

### **1. Frontend (React)**

**Responsibilities:**
- Display user interface
- Handle user input
- Submit code for review
- Display AI suggestions
- Collect user feedback
- Manage user authentication state

**Key Components:**
- `CodeEditor` - Input area for code
- `SuggestionsList` - Display AI suggestions
- `Dashboard` - User's review history
- `LoginPage` - Authentication
- `FeedbackForm` - Collect user ratings

**Technologies:**
- React 18+
- Tailwind CSS (styling)
- Axios (HTTP client)
- Supabase Client (auth & data)

---

### **2. Backend (Node.js/Express)**

**Responsibilities:**
- Authenticate users
- Validate incoming requests
- Call OpenAI API
- Store data in Supabase
- Return suggestions to frontend
- Handle errors

**Key Routes:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/reviews` - Submit code for review
- `GET /api/reviews` - Get user's review history
- `GET /api/reviews/:id` - Get specific review
- `POST /api/feedback` - Submit feedback

**Technologies:**
- Node.js 16+
- Express.js (web framework)
- Supabase Client (database access)
- OpenAI API Client (AI integration)

---

### **3. Database (Supabase/PostgreSQL)**

**Tables:**
1. **users** - User profiles
2. **reviews** - Code submissions & AI suggestions
3. **feedback** - User ratings & comments
4. **error_categories** - Issue categorization

**Security:**
- Row Level Security (RLS) policies
- Foreign key constraints
- Data validation at database level

---

### **4. External Services**

**OpenAI API:**
- Receives code snippets
- Analyzes code quality
- Returns structured suggestions
- Categorizes issues

---

## **Data Flow Diagrams**

### **1. Code Review Submission Flow**

```
User submits code
    ↓
Frontend validates input
    ↓
Send POST /api/reviews with code
    ↓
Backend receives request
    ↓
Verify user authentication (JWT)
    ↓
Store code in database (reviews table)
    ↓
Call OpenAI API with code
    ↓
OpenAI analyzes & returns suggestions
    ↓
Backend stores suggestions in database
    ↓
Return suggestions to frontend
    ↓
Frontend displays results
    ↓
User sees AI suggestions
```

### **2. User Feedback Collection Flow**

```
User sees AI suggestions
    ↓
User rates accuracy (1-10)
User rates helpfulness (1-10)
User rates trust (1-10)
User adds optional comment
    ↓
Submit feedback form
    ↓
POST /api/feedback with ratings
    ↓
Backend stores in feedback table
    ↓
Data available for thesis research
```

### **3. Authentication Flow**

```
User enters email & password
    ↓
Frontend sends to POST /api/auth/login
    ↓
Backend calls Supabase Auth API
    ↓
Supabase verifies credentials
    ↓
Supabase returns JWT token
    ↓
Backend returns token to frontend
    ↓
Frontend stores token locally
    ↓
Token sent with future API requests
    ↓
Backend verifies token for each request
```

---

## **API Endpoints**

### **Authentication**

```
POST /api/auth/register
├─ Request: { email, password, username }
├─ Response: { user, session }
└─ Returns: User object & JWT token

POST /api/auth/login
├─ Request: { email, password }
├─ Response: { user, session }
└─ Returns: User object & JWT token

GET /api/auth/user
├─ Headers: Authorization: Bearer <token>
├─ Response: { user_details }
└─ Returns: Current user information
```

### **Code Reviews**

```
POST /api/reviews
├─ Headers: Authorization: Bearer <token>
├─ Request: { title, code_snippet }
├─ Response: { id, user_id, code_snippet, ai_suggestions, ... }
└─ Action: Submits code for AI review

GET /api/reviews
├─ Headers: Authorization: Bearer <token>
├─ Response: [{ review1 }, { review2 }, ...]
└─ Returns: User's review history

GET /api/reviews/:id
├─ Headers: Authorization: Bearer <token>
├─ Response: { id, user_id, code_snippet, ai_suggestions, ... }
└─ Returns: Specific review details
```

### **Feedback**

```
POST /api/feedback
├─ Request: { 
│   review_id, 
│   accuracy_rating (1-10),
│   helpfulness_rating (1-10),
│   trust_rating (1-10),
│   time_spent_minutes,
│   developer_feedback
│ }
├─ Response: { feedback_object }
└─ Action: Stores user feedback for research
```

---

## **Technology Stack**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18+ | User interface |
| Styling | Tailwind CSS | UI styling |
| HTTP Client | Axios | API requests |
| Backend | Node.js 16+ | Server runtime |
| Framework | Express.js | REST API |
| Database | Supabase | Data storage |
| Auth | Supabase Auth | User authentication |
| AI | OpenAI API | Code analysis |
| Deployment | Vercel (frontend) | Cloud hosting |

---

## **Security Considerations**

### **Frontend Security**
- Store JWT token securely (httpOnly cookie preferred)
- Validate user input before submission
- HTTPS only (enforce in production)
- CORS configured correctly

### **Backend Security**
- Verify JWT token on every protected endpoint
- Validate all incoming data
- Use environment variables for secrets
- Rate limiting on API endpoints
- Input sanitization

### **Database Security**
- Row Level Security (RLS) policies
- Foreign key constraints
- Data encryption at rest (Supabase)
- Secure password hashing (Supabase Auth)

### **API Security**
- No sensitive data in URLs
- Request/response validation
- Error messages don't expose system details
- CORS headers properly configured

---

## **Scalability Considerations**

### **Current Design**
- Single backend server (Node.js)
- PostgreSQL database (Supabase managed)
- OpenAI API calls (rate limited)

### **Future Improvements**
- Load balancing for multiple backend instances
- Caching layer (Redis) for frequently accessed data
- Async job queue for long-running AI tasks
- Database read replicas for heavy queries

---

## **Deployment Architecture**

```
┌──────────────────────────────────────┐
│         GitHub Repository            │
│  ├─ frontend/                        │
│  ├─ backend/                         │
│  └─ database/                        │
└───┬────────────────────────┬─────────┘
    │                        │
    │                        │
┌───▼──────────────────┐ ┌──▼──────────────────┐
│  Vercel              │ │  Backend Hosting    │
│  (Frontend Deploy)   │ │  (Node.js/Express)  │
│  ├─ React app        │ │                     │
│  ├─ Build & serve    │ │  Can be:            │
│  └─ CDN              │ │  • Vercel           │
└────────────────────┬─┘ │  • Railway          │
                     │    │  • Heroku           │
                     │    │  • DigitalOcean     │
                     │    └──────────┬──────────┘
                     │               │
                     └────────┬──────┘
                              │
                         ┌────▼───────────────┐
                         │  Supabase          │
                         │  ├─ PostgreSQL     │
                         │  ├─ Auth           │
                         │  ├─ API            │
                         │  └─ Storage        │
                         └────────────────────┘
```

---

## **Error Handling**

### **Frontend Error Handling**
- Network errors caught by Axios interceptors
- User-friendly error messages displayed
- Retry logic for failed requests
- Form validation before submission

### **Backend Error Handling**
- Try-catch blocks on all async operations
- Proper HTTP status codes returned
- Error logging for debugging
- User-safe error messages (no stack traces)

---

## **Performance Considerations**

### **Frontend Performance**
- Code splitting for faster page loads
- Lazy loading of components
- Debouncing of user input
- Caching of API responses

### **Backend Performance**
- Database indexes on frequently queried columns
- Connection pooling for database
- API response caching where appropriate
- Efficient SQL queries

### **Database Performance**
- Indexes on user_id, created_at, category
- Proper use of JSONB for flexible data
- Query optimization via EXPLAIN ANALYZE

---

## **Summary**

The system follows a **clean three-tier architecture**:

1. **Frontend** (React) - User interface
2. **Backend** (Node.js/Express) - Business logic & API
3. **Database** (Supabase/PostgreSQL) - Data persistence

With **clear separation of concerns**, **security best practices**, and **scalable design**.

All components communicate via:
- REST API (Frontend ↔ Backend)
- Supabase Client SDK (Backend ↔ Database)
- OpenAI API (Backend ↔ AI Service)

---

## **Related Files**
- Database Schema: `database/schema.sql`
- API Documentation: `docs/api.md`
- Deployment Guide: `docs/deployment.md`