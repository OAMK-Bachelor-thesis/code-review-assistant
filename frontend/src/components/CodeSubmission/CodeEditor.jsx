import { useState } from 'react';
import { reviewAPI } from '../../services/api';

export default function CodeEditor({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    language: 'javascript',
    code: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const languages = [
    'javascript',
    'python',
    'java',
    'cpp',
    'csharp',
    'go',
    'rust',
    'typescript',
    'react',
    'sql',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.code.trim()) {
      setError('Code snippet is required');
      return;
    }

    if (formData.code.trim().length < 10) {
      setError('Code snippet must be at least 10 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await reviewAPI.submitReview(
        formData.code,
        formData.title,
        formData.language
      );

      setSuccess('✅ Code submitted! Analyzing...');
      setFormData({ title: '', language: 'javascript', code: '' });

      // Callback to parent with review data
      console.log('Review response:', response);
      if (onSubmitSuccess) {
        onSubmitSuccess(response.review);
      }

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.error || 'Failed to submit code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-hacker-accent mb-6">
         Submit Code for Review
      </h3>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success mb-4">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-hacker-text mb-2 font-medium">
            Code Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Login Function, API Handler"
            className="input-field"
            disabled={isLoading}
          />
          <p className="text-hacker-muted text-sm mt-1">
            Give your code a descriptive title
          </p>
        </div>

        {/* Language Selector */}
        <div>
          <label className="block text-hacker-text mb-2 font-medium">
            Programming Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Code Editor */}
        <div>
          <label className="block text-hacker-text mb-2 font-medium">
            Code Snippet
          </label>
          <textarea
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Paste your code here..."
            className="input-field font-mono"
            rows="12"
            disabled={isLoading}
          />
          <p className="text-hacker-muted text-sm mt-1">
            {formData.code.length} characters | Minimum 10 characters required
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full mt-6 disabled:opacity-50"
        >
          {isLoading ? '🔄 Analyzing...' : ' >_ Submit for Review'}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-hacker-bg border border-hacker-accent border-opacity-30 rounded">
        <p className="text-hacker-muted text-sm">
           <strong>Tip:</strong> Our AI will analyze your code for security vulnerabilities, 
          performance issues, and code quality. You'll receive detailed feedback in seconds!
        </p>
      </div>
    </div>
  );
}
