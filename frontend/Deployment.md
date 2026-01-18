# Deployment Guide

## Local Development

### Quick Start
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

## Cloud Deployment

### Option 1: Vercel + Railway (Recommended)

#### Frontend on Vercel
```bash
cd frontend
npm install -g vercel
vercel deploy
```

Follow prompts, connect GitHub repo.

#### Backend on Railway
1. Go to railway.app
2. Create new project
3. Connect GitHub repo (backend folder)
4. Add environment variables
5. Deploy

#### Update Frontend .env
```
VITE_API_URL=https://your-railway-backend-url
```

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

### Environment Variables

#### Backend (.env)
```
PORT=5000
NODE_ENV=production

SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key

GROQ_API_KEY=your-key
GROQ_MODEL=llama-3.1-8b-instant

JWT_SECRET=your-secret
CORS_ORIGIN=https://your-frontend-url
```

#### Frontend (.env)
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
VITE_API_URL=https://your-backend-url
```

## Database Setup

### Supabase
1. Create project
2. Run SQL schema (see below)
3. Set up RLS policies
4. Create Auth users

### SQL Schema
```sql
-- user_profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  profile_image_url TEXT,
  programming_experience VARCHAR(50),
  role VARCHAR(100),
  survey_completed BOOLEAN DEFAULT FALSE,
  survey_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  code_snippet TEXT NOT NULL,
  language VARCHAR(50),
  score INTEGER,
  ai_suggestions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id),
  accuracy_rating INTEGER,
  helpfulness_rating INTEGER,
  trust_rating INTEGER,
  time_spent_seconds INTEGER,
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
```

## Monitoring

- Check logs in Railway/Vercel dashboard
- Monitor Supabase database usage
- Track API response times
- Review error logs

## Troubleshooting

### 500 Error
- Check backend logs
- Verify environment variables
- Check Supabase connectivity

### CORS Error
- Update CORS_ORIGIN in backend
- Verify frontend URL

### Database Error
- Check RLS policies
- Verify API keys
- Check table schemas

## CI/CD

### GitHub Actions (Optional)
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run build
      - uses: vercel/action@master
```

---

Ready for production! 