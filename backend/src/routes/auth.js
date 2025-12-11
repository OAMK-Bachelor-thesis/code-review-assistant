const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    console.log('Register request body:', req.body);

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ 
        error: 'Email, password, and username are required' 
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ 
        error: 'Email already registered' 
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Create user profile in database
    const { data: user, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          username,
          created_at: new Date(),
        },
      ])
      .select();

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Auth error:', error);

    if (error || !data.user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Get user profile
    const { data: userList, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id);

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    if (!userList || userList.length === 0) {
      return res.status(400).json({ error: 'User profile not found' });
    }

    const user = userList[0];

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/user - Get current user (protected)
router.get('/user', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile
    const { data: userList, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id);

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    if (!userList || userList.length === 0) {
      return res.status(400).json({ error: 'User profile not found' });
    }

    return res.status(200).json(userList[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      await supabase.auth.signOut();
    }

    return res.status(200).json({ 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/verify - Admin endpoint to verify user (testing only)
router.post('/verify', async (req, res) => {
  try {
    const { email } = req.body;

    const { data: userList } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (!userList || userList.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const userId = userList[0].id;

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'User verified' });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;