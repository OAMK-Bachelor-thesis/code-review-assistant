const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reviews', feedbackRoutes);

const profileRoutes = require('./routes/profiles');
app.use('/api/profiles', profileRoutes);


// Statistics endpoint
const authMiddleware = require('./middleware/authMiddleware');

app.get('/api/statistics', authMiddleware, async (req, res) => {
  try {
    const supabase = require('./utils/supabaseClient');
    
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔑 Groq Model: ${process.env.GROQ_MODEL}`);
});


