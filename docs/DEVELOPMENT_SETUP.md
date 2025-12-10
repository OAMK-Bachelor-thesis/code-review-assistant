# Development Environment Setup Guide
## AI-Enhanced Code Review Assistant

**Version:** 1.0  
**Last Updated:** November 2025  
**Target:** Windows, macOS, Linux developers

---

## **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Frontend Setup](#frontend-setup)
3. [Backend Setup](#backend-setup)
4. [Database Configuration](#database-configuration)
5. [Environment Variables](#environment-variables)
6. [Testing the Setup](#testing-the-setup)
7. [Troubleshooting](#troubleshooting)
8. [Running the Application](#running-the-application)

---

## **Prerequisites**

Before starting, ensure you have:

### **Required Software**

- **Git** (v2.30+)
  - Download: https://git-scm.com/download
  - Verify: `git --version`

- **Node.js & npm** (v16+)
  - Download: https://nodejs.org/
  - Choose LTS version
  - Verify: `node --version` and `npm --version`

- **Code Editor** (VS Code recommended)
  - Download: https://code.visualstudio.com/
  - Extensions: ES7+, Prettier, Thunder Client (or Postman)

- **Git client** (Already included with Git, or use GitHub Desktop)

### **Accounts Required**

- [ ] GitHub account (for cloning repo)
- [ ] Supabase account (for database)
- [ ] OpenAI account (for API key)

### **System Requirements**

```
Windows:
- Windows 10 or later
- 4GB RAM minimum (8GB recommended)
- 2GB free disk space

macOS:
- macOS 10.14 or later
- 4GB RAM minimum (8GB recommended)
- 2GB free disk space

Linux:
- Ubuntu 18.04+, Fedora 30+, or similar
- 4GB RAM minimum
- 2GB free disk space
```

---

## **Frontend Setup**

### **Step 1: Clone Repository**

```bash
# Navigate to where you want the project
cd /path/to/projects

# Clone the repository
git clone https://github.com/OAMK-Bachelor-thesis/code-review-assistant.git

# Navigate into project
cd code-review-assistant

# Switch to develop branch
git checkout develop
```

### **Step 2: Setup Frontend Folder**

```bash
# Navigate to frontend folder (or create if doesn't exist)
cd frontend

# If frontend folder doesn't exist, create React app
# Option A: Using create-react-app
npx create-react-app .

# Option B: Using Vite (faster)
npm create vite@latest . -- --template react
```

### **Step 3: Install Frontend Dependencies**

```bash
# Make sure you're in frontend folder
cd frontend

# Install dependencies
npm install

# Install additional packages needed
npm install axios react-router-dom tailwindcss @tailwindcss/forms

# Install Supabase client
npm install @supabase/supabase-js

# Install Lucide React for icons (optional)
npm install lucide-react
```

### **Step 4: Configure Tailwind CSS**

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind config
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### **Step 5: Create Frontend .env.local**

In `frontend/` folder, create `.env.local`:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:5000/api
```

Or if using create-react-app, create `.env`:

```
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_API_URL=http://localhost:5000/api
```

### **Step 6: Verify Frontend Setup**

```bash
# Still in frontend folder
npm run dev
# or
npm start

# Should see: 
# Local: http://localhost:5173 (Vite)
# or
# Local: http://localhost:3000 (create-react-app)
```

Visit the URL - you should see React app running!

---

## **Backend Setup**

### **Step 1: Navigate to Backend Folder**

```bash
# From project root
cd backend

# If backend folder doesn't exist, create it
cd ..
mkdir backend
cd backend
```

### **Step 2: Initialize Node.js Project**

```bash
# Create package.json
npm init -y

# Or if you have a package.json from another source
npm install
```

### **Step 3: Install Backend Dependencies**

```bash
# Core dependencies
npm install express cors dotenv

# Supabase
npm install @supabase/supabase-js

# OpenAI
npm install openai

# Authentication
npm install jsonwebtoken

# Environment
npm install dotenv

# Optional: Development tools
npm install -D nodemon
```

### **Step 4: Create Backend File Structure**

```bash
# Create folders
mkdir src
mkdir src/routes
mkdir src/middleware
mkdir src/controllers
mkdir src/utils

# Create main server file
touch src/server.js

# Create .env file
touch .env
```

### **Step 5: Create Backend .env**

In `backend/` folder, create `.env`:

```
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI
OPENAI_API_KEY=your_openai_key_here

# JWT
JWT_SECRET=your_jwt_secret_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### **Step 6: Create Basic Express Server**

Create `backend/src/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### **Step 7: Update package.json Scripts**

Edit `backend/package.json`:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### **Step 8: Verify Backend Setup**

```bash
# From backend folder
npm run dev

# Should see:
# Server running on http://localhost:5000

# Test in another terminal:
curl http://localhost:5000/api/health
# Should return: {"message":"Server is running!"}
```

---

## **Database Configuration**

### **Step 1: Get Supabase Credentials**

1. Go to: https://app.supabase.com
2. Click your project
3. Go to **Settings → API**
4. Copy:
   - Project URL
   - anon public key
   - service_role key

### **Step 2: Update Environment Files**

Add to `backend/.env`:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Add to `frontend/.env.local` (or `.env`):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### **Step 3: Test Supabase Connection**

Create `backend/src/utils/supabaseClient.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

Create `backend/src/testSupabase.js`:

```javascript
const supabase = require('./utils/supabaseClient');

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('Users table accessible');
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();
```

Run test:
```bash
node src/testSupabase.js
```

---

## **Environment Variables**

### **Complete .env Template**

**Backend `.env`:**
```
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Configuration
OPENAI_API_KEY=sk-...

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Frontend `.env` (create-react-app):**
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_API_URL=http://localhost:5000/api
```

**Frontend `.env.local` (Vite):**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:5000/api
```

### **Getting Your Values**

```
SUPABASE_URL:
- Go to: https://app.supabase.com
- Click your project
- Settings → API
- Copy "Project URL"

SUPABASE_ANON_KEY:
- Same location
- Copy "anon public"

SUPABASE_SERVICE_ROLE_KEY:
- Same location
- Copy "service_role" (SECRET - never commit!)

OPENAI_API_KEY:
- Go to: https://platform.openai.com/api-keys
- Create new secret key
- Copy it

JWT_SECRET:
- Generate random string: https://www.uuidgenerator.net/
- Or: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## **Testing the Setup**

### **Test 1: Frontend Running**

```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# Visit: http://localhost:3000 or http://localhost:5173
```

### **Test 2: Backend Running**

```bash
# Terminal 2: Backend
cd backend
npm run dev
# Should show: Server running on http://localhost:5000
```

### **Test 3: API Connection**

```bash
# Terminal 3: Test API
curl http://localhost:5000/api/health
# Should return: {"message":"Server is running!"}
```

### **Test 4: Supabase Connection**

```bash
# In backend terminal
node src/testSupabase.js
# Should show: ✅ Supabase connection successful!
```

### **Test 5: Frontend-Backend Communication**

Create `frontend/src/test-api.js`:

```javascript
async function testAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ Frontend-Backend communication working!');
    console.log('Response:', data);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testAPI();
```

Run: `node src/test-api.js`

---

## **Running the Application**

### **Terminal Setup (3 terminals needed)**

**Terminal 1: Frontend**
```bash
cd frontend
npm run dev
# Runs on: http://localhost:3000 (or 5173)
```

**Terminal 2: Backend**
```bash
cd backend
npm run dev
# Runs on: http://localhost:5000
```

**Terminal 3: Monitoring/Testing**
```bash
# Keep available for testing, deployments, etc.
```

### **Quick Start Script (Optional)**

Create `run.sh` (macOS/Linux) or `run.bat` (Windows) in project root:

**run.sh:**
```bash
#!/bin/bash
# Start frontend in background
cd frontend && npm run dev &
FRONTEND_PID=$!

# Start backend in background
cd ../backend && npm run dev &
BACKEND_PID=$!

echo "Frontend (PID: $FRONTEND_PID) running on http://localhost:3000"
echo "Backend (PID: $BACKEND_PID) running on http://localhost:5000"
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
wait
```

**run.bat (Windows):**
```batch
@echo off
start cmd /k "cd frontend && npm run dev"
start cmd /k "cd backend && npm run dev"
echo Frontend running on http://localhost:3000
echo Backend running on http://localhost:5000
```

---

## **Troubleshooting**

### **Issue: Port Already in Use**

```
Error: EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=5001
```

### **Issue: Module Not Found**

```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **Issue: Environment Variables Not Loading**

```
Error: Cannot read property 'split' of undefined
```

**Solution:**
1. Verify `.env` file exists in correct folder
2. Restart development server
3. Check variable name matches (case-sensitive)
4. Verify no spaces around `=`

### **Issue: Supabase Connection Failed**

```
Error: Invalid API key or URL
```

**Solution:**
1. Verify correct keys copied from Supabase
2. Check .env file has correct values
3. Make sure not using service_role key in frontend (use anon key)
4. Restart server after changing .env

### **Issue: OpenAI API Key Error**

```
Error: Invalid API key provided
```

**Solution:**
1. Verify key starts with `sk-`
2. Check key not expired
3. Verify correct key copied from OpenAI dashboard
4. Don't include extra spaces

### **Issue: CORS Error in Frontend**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify backend has CORS enabled
2. Check `CORS_ORIGIN` matches frontend URL
3. Restart backend server
4. Clear browser cache

### **Issue: npm install takes forever**

```
Solution:
npm install --no-audit --no-fund
```

### **Issue: Git Pull Conflicts**

```
Error: Your local changes would be overwritten
```

**Solution:**
```bash
git stash  # Save your changes
git pull origin develop  # Pull latest
git stash pop  # Restore your changes (may have conflicts)
```

---

## **Verification Checklist**

Before starting development, verify:

- [ ] Node.js installed (`node --version` shows v16+)
- [ ] npm installed (`npm --version` shows v7+)
- [ ] Git installed (`git --version`)
- [ ] Repository cloned
- [ ] Frontend folder setup
- [ ] Backend folder setup
- [ ] `.env` files created with all values
- [ ] Dependencies installed (`node_modules` exists)
- [ ] Frontend runs without errors
- [ ] Backend runs without errors
- [ ] Supabase connection works
- [ ] OpenAI API key works
- [ ] Frontend-Backend communication works

---

## **Next Steps**

Once setup is complete:

1. ✅ Frontend development ready (Week 4)
2. ✅ Backend development ready (Week 4)
3. ✅ Database configured and tested
4. ✅ All environment variables set
5. ✅ Ready to implement features

---

## **Useful Commands**

```bash
# Frontend commands
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend commands
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start server

# Git commands
git checkout develop # Switch to develop branch
git pull origin develop  # Get latest changes
git branch          # List branches
git status          # Check status

# Node/npm commands
npm list            # List installed packages
npm outdated        # Check for updates
npm update          # Update packages
npm cache clean --force  # Clear npm cache
```

---

## **Support**

For issues not covered here:
1. Check error message carefully
2. Search GitHub issues
3. Check Supabase docs: https://supabase.com/docs
4. Check OpenAI docs: https://platform.openai.com/docs
5. Ask supervisor or team partner

---

**Setup Created:** November 2025  
**Status:** Ready for Week 4 Development

---