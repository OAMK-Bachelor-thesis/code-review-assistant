import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuthStore } from '../../stores/authStore';

export default function SurveyForm({ onSuccess }) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    programming_experience: 'Beginner',
    role: 'Software Engineering Student',
  });

  const experiences = [
    'Beginner',
    'Intermediate (1-3 years)',
    'Advanced (3-5 years)',
    'Expert (5+ years)',
  ];

  const roles = [
    'Software Engineering Student',
    'Computer Science Student',
    'Lecturer',
    'Industry Developer',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name,
          programming_experience: formData.programming_experience,
          role: formData.role,
          survey_completed: true,
          survey_completed_at: new Date(),
          updated_at: new Date(),
        });

      if (updateError) {
        throw new Error(updateError.message);
      }

      alert('✅ Survey information saved successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to save survey');
      console.error('Survey error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-hacker-accent mb-4">
         Background Information
      </h3>

      <p className="text-hacker-muted mb-6">
        Help us understand your background for better research insights
      </p>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-hacker-text mb-2 font-medium">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {/* Programming Experience */}
        <div>
          <label className="block text-hacker-text mb-2 font-medium">
            Programming Experience
          </label>
          <select
            name="programming_experience"
            value={formData.programming_experience}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            {experiences.map(exp => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-hacker-text mb-2 font-medium">
            Your Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          >
            {roles.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {isLoading ? '⏳ Saving...' : '✅ Save Information'}
        </button>
      </form>
    </div>
  );
}
