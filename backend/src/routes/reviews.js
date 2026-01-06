
/**
 * reviewsRoutes.js (or similar route module)
 *
 * Purpose:
 * - Provides authenticated API endpoints for creating and managing code review records.
 * - Connects user-submitted code snippets to an AI analysis service (Groq) and persists results in Supabase.
 */
const express = require('express');
const router = express.Router();

// Supabase client used to persist and query review data.
const supabase = require('../utils/supabaseClient');

// Service wrapper for AI-based code analysis.
const groqService = require('../services/groqService');

// Middleware that authenticates the request (e.g., JWT) and attaches `req.user`.
const authMiddleware = require('../middleware/authMiddleware');


/**
 * POST /
 * Create a new code review:
 * - Validates user input (code and title)
 * - Sends code to AI analysis service
 * - Stores the result (analysis + score) to the database under the authenticated user
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Input fields sent by the client.
    const { code, title, language } = req.body;

   // User identity comes from authMiddleware, not from request body (prevents spoofing).
    const userId = req.user.id;

   // Basic validation to avoid storing empty payloads and to provide clear API feedback to the client.
    if (!code || code.trim().length === 0) {
      return res.status(400).json({ error: 'Code snippet is required' });
    }

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    console.log('Analyzing code for user:', userId);

   // AI analysis call:
    const { analysis } = await groqService.analyzeCode(code);

  // Persist a full review record to Supabase.
    const { data: review, error: dbError } = await supabase
      .from('reviews')
      .insert([
        {
          user_id: userId,
          title: title,
          code_snippet: code,
          language: language || 'javascript',
          ai_suggestions: analysis,
          score: analysis.score || 0,
          created_at: new Date(),
        },
      ])
      .select();

    // DB error handling: return a client-safe message.
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(400).json({ error: dbError.message });
    }

    // API response intentionally returns a smaller subset of DB fields:
    return res.status(201).json({
      message: 'Code analysis complete',
      review: {
        id: review[0].id,
        title: review[0].title,
        score: review[0].score,
        analysis: analysis,
      },
    });
  } catch (error) {
    console.error('Review creation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

/**
 * GET /
 * Fetch a paginated list of the authenticated user's reviews.
 *
 * Query params:
 * - page: page number (default: 1)
 * - limit: items per page (default: 10)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination parameters: parsed from query string and converted to integers.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Count total records for this user (used for pagination info on the client).
    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (countError) {
      return res.status(400).json({ error: countError.message });
    }

    // Fetch one page of results using range(offset, offset + limit - 1).
    const { data: reviews, error: dbError } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    return res.status(200).json({
      reviews: reviews || [],
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /:id
 * Fetch a single review by id for the authenticated user.
 *
 * Security:
 * - The query includes both `id` and `user_id` so a user cannot access another user's review.
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // `.single()` indicates we expect exactly one record (or an error if none found).
    const { data: review, error: dbError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    // If record doesn't exist or belongs to a different user, treat as not found.
    if (dbError || !review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error('Get review error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /:id
 * Delete a review record by id for the authenticated user.
 *
 * Security:
 * - The delete operation is scoped by both `id` and `user_id`.
 * - Prevents one user from deleting another user's records.
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error: dbError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
