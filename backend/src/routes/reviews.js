const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const groqService = require('../services/groqService');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/reviews - Submit code for analysis
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { code, title, language } = req.body;
    const userId = req.user.id;

    if (!code || code.trim().length === 0) {
      return res.status(400).json({ error: 'Code snippet is required' });
    }

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    console.log('Analyzing code for user:', userId);

    const { analysis } = await groqService.analyzeCode(code);
    
    console.log('Analysis result:', analysis);

    const { data: reviews, error: dbError } = await supabase
      .from('reviews')
      .insert([
        {
          user_id: userId,
          title: title,
          code_snippet: code,
          language: language || 'javascript',
          ai_suggestions: analysis,
          score: analysis?.score || 0,
          created_at: new Date(),
        },
      ])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(400).json({ error: dbError.message });
    }

    console.log('Review saved:', reviews[0]);

    return res.status(201).json({
      message: 'Code analysis complete',
      review: {
        id: reviews[0].id,
        title: reviews[0].title,
        language: reviews[0].language,
        code_snippet: reviews[0].code_snippet,
        score: reviews[0].score,
        analysis: analysis,
        created_at: reviews[0].created_at,
      },
    });
  } catch (error) {
    console.error('Review creation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
});

// GET /api/reviews - Get user's reviews
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (countError) {
      return res.status(400).json({ error: countError.message });
    }

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

// GET /api/reviews/:id - Get specific review
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: review, error: dbError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (dbError || !review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error('Get review error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/reviews/:id - Delete review
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