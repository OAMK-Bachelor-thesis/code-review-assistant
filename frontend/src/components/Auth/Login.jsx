import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authAPI } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.session && response.session.access_token) {
        setAuth(response.user, response.session.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setLocalError(err.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-hacker-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-hacker-accent mb-2 glow">
            &gt; CODE_REVIEW
          </h1>
          <p className="text-hacker-muted">AI-Enhanced Code Review Assistant</p>
        </div>

        {/* Login Card */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-hacker-accent mb-6">Login</h2>

          {/* Error Alert */}
          {(localError || error) && (
            <div className="alert alert-danger mb-4">
              {localError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-hacker-text mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-hacker-text mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-6 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center text-hacker-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-hacker-accent hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
