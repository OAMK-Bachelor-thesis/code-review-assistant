# AI-Enhanced Code Review Assistant

A full-stack web application for AI-assisted code review using Groq LLM integration.

## Project Overview

This thesis project demonstrates an AI-enhanced code review system that tests whether AI-assisted code review is more accurate and faster than manual review. The system uses Groq's LLaMA 3.1 8B model to analyze code submissions and provide intelligent feedback.

## Features

### Core Functionality
- **User Authentication**: Secure register/login/logout with JWT
- **Code Submission**: Submit code in 10+ programming languages
- **AI Analysis**: Intelligent code analysis using Groq LLaMA 3.1
- **Results Display**: Issues, suggestions, and quality scores
- **Feedback Collection**: Rate accuracy, helpfulness, and trust (1-10)
- **Review History**: View and manage past reviews with pagination
- **Statistics**: Aggregate metrics on AI performance and user feedback
- **User Profiles**: Manage profile information and upload pictures

### Technical Features
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Professional UI**: Hacker-themed dark mode interface
- **RESTful API**: Complete backend API with proper error handling
- **Database**: PostgreSQL with Supabase
- **Security**: Row-level security policies, JWT authentication

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth + JWT
- **AI Integration**: Groq API (LLaMA 3.1 8B)

### Infrastructure
- **Database**: Supabase
- **Real-time**: WebSocket ready

## Project Structure
```
code-review-assistant/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── CodeSubmission/
│   │   │   └── Layout/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- Supabase account
- Groq API key

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.local .env

# Set environment variables:
# SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# GROQ_API_KEY, GROQ_MODEL
# JWT_SECRET, PORT, CORS_ORIGIN

npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.local .env

# Set environment variables:
# VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
# VITE_API_URL

npm run dev
```

Visit: http://localhost:5173

## Database Schema

### user_profiles
- `id` (UUID, PK)
- `email` (TEXT, UNIQUE)
- `full_name` (TEXT)
- `profile_image_url` (TEXT)
- `programming_experience` (VARCHAR)
- `role` (VARCHAR)
- `survey_completed` (BOOLEAN)
- `survey_completed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### reviews
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `title` (TEXT)
- `code_snippet` (TEXT)
- `language` (VARCHAR)
- `score` (INTEGER 0-100)
- `ai_suggestions` (JSONB)
- `created_at` (TIMESTAMP)

### feedback
- `id` (UUID, PK)
- `review_id` (UUID, FK)
- `accuracy_rating` (INTEGER 1-10)
- `helpfulness_rating` (INTEGER 1-10)
- `trust_rating` (INTEGER 1-10)
- `time_spent_seconds` (INTEGER)
- `comments` (TEXT)
- `created_at` (TIMESTAMP)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user

### Code Reviews
- `POST /api/reviews` - Submit code for review
- `GET /api/reviews` - Get user's reviews (paginated)
- `GET /api/reviews/:id` - Get specific review
- `DELETE /api/reviews/:id` - Delete review

### Feedback
- `POST /api/reviews/:reviewId/feedback` - Submit feedback
- `GET /api/reviews/:reviewId/feedback` - Get review feedback
- `GET /api/statistics` - Get research statistics

### User Profiles
- `GET /api/profiles` - Get user profile
- `PUT /api/profiles` - Update profile
- `POST /api/profiles/image` - Upload profile image

## Usage

### For Researchers

1. **Register** and create account
2. **Fill Profile** with background information
3. **Submit Code** for analysis
4. **View Results** from AI analysis
5. **Provide Feedback** on accuracy and helpfulness
6. **Check Statistics** to see aggregate data

### For Developers

The system is ready for:
- User testing with custom cohorts
- A/B testing different AI models
- Comparative analysis of AI vs manual review
- Training data collection for model improvement

## Google Form Survey

Research participants complete a survey covering:
- Programming experience level
- Current role/background
- 10 Likert-scale questions (1-5) on:
  - Ease of use
  - AI accuracy
  - UI/UX design
  - Likelihood to use
- Open-ended feedback

## Test Results

The system successfully:
✅ Processes code submissions in 10+ languages
✅ Generates AI analysis within seconds
✅ Collects user feedback with 1-10 ratings
✅ Aggregates statistics for analysis
✅ Stores all data persistently
✅ Provides responsive user interface
✅ Handles authentication securely

## Known Limitations

### Network Connectivity
Due to system-level network restrictions, the backend cannot reach Supabase in certain environments. Workarounds:
- Use VPN (ProtonVPN, TunnelBear)
- Deploy to cloud (Vercel, Railway)
- Test on different network

This is an environmental issue, not a code issue. The system is production-ready for cloud deployment.

## Deployment

### Vercel (Frontend)
```bash
cd frontend
vercel deploy
```

### Railway or Render (Backend)
```bash
cd backend
# Push to GitHub and connect to Railway/Render
```

## Future Enhancements

- [ ] Multiple AI model comparison
- [ ] Code syntax highlighting
- [ ] Export reviews as PDF
- [ ] Team code review features
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] GitHub integration

## Research Insights

This project enables research into:
- AI code review effectiveness
- User trust in AI-assisted development
- Developer productivity improvements
- Code quality metrics
- Human-AI collaboration patterns

## License

MIT License - See LICENSE file for details

## Authors

**Hasitha Hiththatiyage**
**Nipuni Kodikara**


## Acknowledgments

- Groq for LLaMA 3.1 API access
- Supabase for database infrastructure
- OAMK for thesis guidance

---

**Status**: Complete and ready for user testing and deployment