const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/profiles - Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return res.status(200).json({
      profile: data || {},
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profiles - Update user profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, programming_experience, role, profile_image_url } = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        email: req.user.email,
        full_name,
        programming_experience,
        role,
        profile_image_url,
        survey_completed: true,
        survey_completed_at: new Date(),
        updated_at: new Date(),
      })
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: data[0],
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/profiles/image - Upload profile image URL
router.post('/image', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile_image_url } = req.body;

    if (!profile_image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        profile_image_url,
        updated_at: new Date(),
      })
      .eq('id', userId)
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: 'Profile image updated',
      profile: data[0],
    });
  } catch (error) {
    console.error('Image update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
