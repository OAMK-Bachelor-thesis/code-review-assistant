const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/reviews/statistics - Get feedback statistics for research (MUST BE FIRST)
router.get('/statistics', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all feedback for user's reviews
    const { data: allFeedback, error: dbError } = await supabase
      .from('feedback')
      .select('accuracy_rating, helpfulness_rating, trust_rating, time_spent_seconds');

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    if (!allFeedback || allFeedback.length === 0) {
      return res.status(200).json({
        statistics: {
          total_feedback: 0,
          average_accuracy: 0,
          average_helpfulness: 0,
          average_trust: 0,
          average_time_spent: 0,
        },
      });
    }

    // Calculate statistics
    const total = allFeedback.length;
    const avgAccuracy = (allFeedback.reduce((sum, f) => sum + f.accuracy_rating, 0) / total).toFixed(2);
    const avgHelpfulness = (allFeedback.reduce((sum, f) => sum + f.helpfulness_rating, 0) / total).toFixed(2);
    const avgTrust = (allFeedback.reduce((sum, f) => sum + f.trust_rating, 0) / total).toFixed(2);
    const avgTime = (allFeedback.reduce((sum, f) => sum + f.time_spent_seconds, 0) / total).toFixed(2);

    return res.status(200).json({
      statistics: {
        total_feedback: total,
        average_accuracy: parseFloat(avgAccuracy),
        average_helpfulness: parseFloat(avgHelpfulness),
        average_trust: parseFloat(avgTrust),
        average_time_spent: parseFloat(avgTime),
      },
    });
  } catch (error) {
    console.error('Statistics error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reviews/:reviewId/feedback - Submit feedback for a review
router.post('/:reviewId/feedback', authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { accuracy, helpfulness, trust, time_spent, comments } = req.body;
    const userId = req.user.id;

    // Validate ratings (1-10)
    if (!accuracy || accuracy < 1 || accuracy > 10) {
      return res.status(400).json({ error: 'Accuracy rating must be 1-10' });
    }

    if (!helpfulness || helpfulness < 1 || helpfulness > 10) {
      return res.status(400).json({ error: 'Helpfulness rating must be 1-10' });
    }

    if (!trust || trust < 1 || trust > 10) {
      return res.status(400).json({ error: 'Trust rating must be 1-10' });
    }

    // Validate review exists and belongs to user
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('id', reviewId)
      .eq('user_id', userId)
      .single();

    if (reviewError || !review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if feedback already exists
    const { data: existingFeedback } = await supabase
      .from('feedback')
      .select('id')
      .eq('review_id', reviewId);

    if (existingFeedback && existingFeedback.length > 0) {
      return res.status(400).json({ error: 'Feedback already submitted for this review' });
    }

    // Create feedback record
    const { data: feedback, error: dbError } = await supabase
      .from('feedback')
      .insert([
        {
          review_id: reviewId,
          accuracy_rating: accuracy,
          helpfulness_rating: helpfulness,
          trust_rating: trust,
          time_spent_seconds: time_spent || 0,
          comments: comments || null,
          created_at: new Date(),
        },
      ])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(400).json({ error: dbError.message });
    }

    return res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback[0].id,
        review_id: feedback[0].review_id,
        accuracy: feedback[0].accuracy_rating,
        helpfulness: feedback[0].helpfulness_rating,
        trust: feedback[0].trust_rating,
        time_spent: feedback[0].time_spent_seconds,
      },
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reviews/:reviewId/feedback - Get feedback for a review
router.get('/:reviewId/feedback', authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Verify review exists and belongs to user
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('id', reviewId)
      .eq('user_id', userId)
      .single();

    if (reviewError || !review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Get feedback
    const { data: feedback, error: dbError } = await supabase
      .from('feedback')
      .select('*')
      .eq('review_id', reviewId)
      .single();

    if (dbError || !feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    return res.status(200).json({
      feedback: {
        id: feedback.id,
        review_id: feedback.review_id,
        accuracy: feedback.accuracy_rating,
        helpfulness: feedback.helpfulness_rating,
        trust: feedback.trust_rating,
        time_spent: feedback.time_spent_seconds,
        comments: feedback.comments,
        created_at: feedback.created_at,
      },
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;