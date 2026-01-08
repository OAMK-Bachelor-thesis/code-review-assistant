import { useState } from 'react';
import { feedbackAPI } from '../../services/api';

export default function FeedbackForm({ reviewId, onSuccess }) {
  const [formData, setFormData] = useState({
    accuracy: 5,
    helpfulness: 5,
    trust: 5,
    time_spent: 0,
    comments: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.accuracy < 1 || formData.accuracy > 10) {
      setError('Accuracy must be between 1-10');
      return;
    }

    if (formData.helpfulness < 1 || formData.helpfulness > 10) {
      setError('Helpfulness must be between 1-10');
      return;
    }

    if (formData.trust < 1 || formData.trust > 10) {
      setError('Trust must be between 1-10');
      return;
    }

    setIsLoading(true);

    try {
      await feedbackAPI.submitFeedback(
        reviewId,
        formData.accuracy,
        formData.helpfulness,
        formData.trust,
        formData.time_spent,
        formData.comments
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.error || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h4 className="text-xl font-bold text-hacker-accent mb-6">
        📝 Share Your Feedback
      </h4>

      <p className="text-hacker-muted mb-6">
        Help us improve! Rate your experience with this AI analysis.
      </p>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Accuracy Rating */}
        <div>
          <label className="block text-hacker-text mb-3 font-medium">
            How accurate was the analysis?
            <span className="text-hacker-accent ml-2">{formData.accuracy}/10</span>
          </label>
          <input
            type="range"
            name="accuracy"
            min="1"
            max="10"
            value={formData.accuracy}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full h-2 bg-hacker-surface rounded appearance-none cursor-pointer accent-hacker-accent"
          />
          <div className="flex justify-between text-hacker-muted text-xs mt-2">
            <span>Not Accurate</span>
            <span>Very Accurate</span>
          </div>
        </div>

        {/* Helpfulness Rating */}
        <div>
          <label className="block text-hacker-text mb-3 font-medium">
            How helpful were the suggestions?
            <span className="text-hacker-accent ml-2">{formData.helpfulness}/10</span>
          </label>
          <input
            type="range"
            name="helpfulness"
            min="1"
            max="10"
            value={formData.helpfulness}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full h-2 bg-hacker-surface rounded appearance-none cursor-pointer accent-hacker-accent"
          />
          <div className="flex justify-between text-hacker-muted text-xs mt-2">
            <span>Not Helpful</span>
            <span>Very Helpful</span>
          </div>
        </div>

        {/* Trust Rating */}
        <div>
          <label className="block text-hacker-text mb-3 font-medium">
            How much do you trust this feedback?
            <span className="text-hacker-accent ml-2">{formData.trust}/10</span>
          </label>
          <input
            type="range"
            name="trust"
            min="1"
            max="10"
            value={formData.trust}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full h-2 bg-hacker-surface rounded appearance-none cursor-pointer accent-hacker-accent"
          />
          <div className="flex justify-between text-hacker-muted text-xs mt-2">
            <span>Don't Trust</span>
            <span>Trust Completely</span>
          </div>
        </div>

        {/* Time Spent */}
        <div>
          <label className="block text-hacker-text mb-2 font-medium">
            Time spent reviewing (seconds)
          </label>
          <input
            type="number"
            name="time_spent"
            min="0"
            value={formData.time_spent}
            onChange={handleChange}
            placeholder="0"
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block text-hacker-text mb-2 font-medium">
            Additional comments (optional)
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Share any additional thoughts..."
            className="input-field"
            rows="4"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {isLoading ? '⏳ Submitting...' : '✅ Submit Feedback'}
        </button>
      </form>

      {/* Info */}
      <p className="text-hacker-muted text-sm mt-6 p-4 bg-hacker-bg rounded border border-hacker-accent border-opacity-20">
        💡 Your feedback helps us improve the AI analysis. Thank you for participating in our research!
      </p>
    </div>
  );
}
