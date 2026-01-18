import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { useAuthStore } from '../stores/authStore';
import { profileAPI } from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await profileAPI.getProfile();
        const profileData = response.profile || {};
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          programming_experience: profileData.programming_experience || 'Beginner',
          role: profileData.role || 'Software Engineering Student',
        });
      } catch (err) {
        setError(err.error || 'Failed to load profile');
        console.error('Profile error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!imagePreview) {
      setError('Please select an image');
      return;
    }

    setError('');
    setIsUploadingImage(true);

    try {
      
      await profileAPI.uploadProfileImage(imagePreview);
      
      alert('✅ Profile picture updated!');
      setImagePreview(null);
      
      // Reload profile
      const response = await profileAPI.getProfile();
      setProfile(response.profile || {});
    } catch (err) {
      setError(err.error || 'Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setError('');
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }

    setIsSaving(true);
    try {
      await profileAPI.updateProfile(
        formData.full_name,
        formData.programming_experience,
        formData.role
      );
      alert('✅ Profile updated successfully!');
      setIsEditing(false);
      
      // Reload profile
      const response = await profileAPI.getProfile();
      setProfile(response.profile || {});
    } catch (err) {
      setError(err.error || 'Failed to update profile');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hacker-bg text-hacker-text flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-hacker-accent">⏳ Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-text flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-hacker-accent glow">
            👤 My Profile
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              title="Back to Dashboard"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-primary"
            >
              {isEditing ? '❌ Cancel' : '✏️ Edit'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Profile Picture */}
          <div className="card">
            <h3 className="text-lg font-bold text-hacker-accent mb-6">
              📸 Profile Picture
            </h3>

            {/* Avatar Display */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-hacker-accent flex items-center justify-center overflow-hidden border-2 border-hacker-accent flex-shrink-0">
                {profile?.profile_image_url ? (
                    <img
                    src={profile.profile_image_url}
                    alt={user?.email}
                    className="avatar-profile"
                    />

                ) : (
                  <span className="text-black text-2xl font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Image Upload */}
            {isEditing && (
              <div className="space-y-4">
                {imagePreview && (
                  <div className="text-center mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="avatar-preview"
                    />
                    <p className="text-hacker-muted text-xs mt-2">Preview</p>
                  </div>
                )}

                <div>
                  <label className="block text-hacker-text mb-2 font-medium text-sm">
                    Choose Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploadingImage}
                    className="input-field w-full text-sm"
                  />
                  <p className="text-hacker-muted text-xs mt-1">
                    JPG, PNG or GIF (Max 5MB)
                  </p>
                </div>

                <button
                  onClick={handleUploadImage}
                  disabled={isUploadingImage || !imagePreview}
                  className="btn btn-primary w-full disabled:opacity-50 text-sm"
                >
                  {isUploadingImage ? '⏳ Uploading...' : '🚀 Upload Image'}
                </button>
              </div>
            )}
          </div>

          {/* Middle Column: Profile Info */}
          <div className="card md:col-span-2">
            <h3 className="text-lg font-bold text-hacker-accent mb-6">
              📊 Profile Information
            </h3>

            {isEditing ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-hacker-text mb-2 font-medium text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="input-field w-full"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-hacker-text mb-2 font-medium text-sm">
                    Programming Experience
                  </label>
                  <select
                    name="programming_experience"
                    value={formData.programming_experience}
                    onChange={handleChange}
                    className="input-field w-full"
                    disabled={isSaving}
                  >
                    {experiences.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-hacker-text mb-2 font-medium text-sm">
                    Your Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field w-full"
                    disabled={isSaving}
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary w-full disabled:opacity-50"
                >
                  {isSaving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
                <div>
                  <p className="text-hacker-muted text-xs uppercase tracking-wide">Email</p>
                  <p className="text-hacker-text font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-hacker-muted text-xs uppercase tracking-wide">Full Name</p>
                  <p className="text-hacker-text font-medium">
                    {profile?.full_name || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-hacker-muted text-xs uppercase tracking-wide">Experience</p>
                  <p className="text-hacker-text font-medium">
                    {profile?.programming_experience || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-hacker-muted text-xs uppercase tracking-wide">Role</p>
                  <p className="text-hacker-text font-medium">
                    {profile?.role || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-hacker-muted text-xs uppercase tracking-wide">Member Since</p>
                  <p className="text-hacker-text font-medium">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString()
                      : '—'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Research Status */}
        <div className="mt-8 card">
          <h3 className="text-lg font-bold text-hacker-accent mb-4">
            ✅ Research Status
          </h3>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${profile?.survey_completed ? 'text-hacker-success' : 'text-hacker-muted'}`}>
              {profile?.survey_completed ? '✓' : '○'}
            </span>
            <div>
              <p className="text-hacker-text font-medium">Survey Status</p>
              <p className="text-hacker-muted text-sm">
                {profile?.survey_completed 
                  ? `Completed on ${new Date(profile.survey_completed_at).toLocaleDateString()}`
                  : 'Complete your profile to participate in research'}
              </p>
            </div>
          </div>
          <p className="text-hacker-muted text-sm mt-4">
            💡 Thank you for participating! Your feedback helps us improve AI code review.
          </p>
        </div>
      </div>
    </div>
  );
}
