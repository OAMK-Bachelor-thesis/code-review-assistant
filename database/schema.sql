-- Database Schema for Code Review Assistant
-- Created: November 2025

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: Users
-- ============================================
-- Description: Stores user information linked to Supabase Auth
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- TABLE 2: Reviews
-- ============================================
-- Description: Stores code submissions and AI suggestions
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  code_snippet TEXT NOT NULL,
  ai_suggestions JSONB NOT NULL DEFAULT '{}',
  severity_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_severity ON reviews(severity_level);

-- ============================================
-- TABLE 3: Feedback
-- ============================================
-- Description: Stores developer feedback on AI suggestions (for research)
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  developer_feedback TEXT,
  accuracy_rating INT CHECK (accuracy_rating >= 1 AND accuracy_rating <= 10),
  helpfulness_rating INT CHECK (helpfulness_rating >= 1 AND helpfulness_rating <= 10),
  trust_rating INT CHECK (trust_rating >= 1 AND trust_rating <= 10),
  time_spent_minutes INT CHECK (time_spent_minutes >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster feedback lookups
CREATE INDEX idx_feedback_review_id ON feedback(review_id);

-- ============================================
-- TABLE 4: Error Categories
-- ============================================
-- Description: Tracks what types of errors were found (security, performance, etc.)
CREATE TABLE error_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  detected_by VARCHAR(50) NOT NULL,
  is_valid BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for category analysis
CREATE INDEX idx_error_categories_review_id ON error_categories(review_id);
CREATE INDEX idx_error_categories_category ON error_categories(category);
CREATE INDEX idx_error_categories_detected_by ON error_categories(detected_by);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
-- This ensures users can only see their own data

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- ---- USERS TABLE ----
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---- REVIEWS TABLE ----
-- Policy: Users can view their own reviews
CREATE POLICY "Users can view own reviews"
  ON reviews
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create reviews
CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- ---- FEEDBACK TABLE ----
-- Policy: Users can view feedback on their reviews
CREATE POLICY "Users can view feedback on own reviews"
  ON feedback
  FOR SELECT
  USING (
    review_id IN (
      SELECT id FROM reviews WHERE user_id = auth.uid()
    )
  );

-- Policy: Anyone can submit feedback (for research)
CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  WITH CHECK (true);

-- ---- ERROR_CATEGORIES TABLE ----
-- Policy: Users can view error categories for their reviews
CREATE POLICY "Users can view error categories on own reviews"
  ON error_categories
  FOR SELECT
  USING (
    review_id IN (
      SELECT id FROM reviews WHERE user_id = auth.uid()
    )
  );

-- Policy: Authenticated users can insert error categories
CREATE POLICY "Authenticated users can insert error categories"
  ON error_categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
  
