import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authAPI } from '../../services/api';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
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

    // Validation
    if (!formData.email || !formData.password || !formData.username) {
      setLocalError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await authAPI.register(
        formData.email,
        formData.password,
        formData.username
      );

      if (response.user) {
        // Auto-login after registration
        const loginResponse = await authAPI.login(formData.email, formData.password);
        setAuth(loginResponse.user, loginResponse.session.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setLocalError(err.error || 'Registration failed. Please try again.');
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
          <p className="text-hacker-muted">Create Your Account</p>
        </div>

        {/* Register Card */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-hacker-accent mb-6">Register</h2>

          {/* Error Alert */}
          {(localError || error) && (
            <div className="alert alert-danger mb-4">
              {localError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-hacker-text mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="your_username"
                className="input-field"
                disabled={isLoading}
              />
            </div>

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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-hacker-text mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center text-hacker-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-hacker-accent hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}