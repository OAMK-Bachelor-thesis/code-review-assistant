import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import CodeEditor from '../components/CodeSubmission/CodeEditor';
import ResultsDisplay from '../components/CodeSubmission/ResultsDisplay';
import ReviewHistory from '../components/CodeSubmission/ReviewHistory';
import Statistics from '../components/CodeSubmission/Statistics';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('submit');
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        setProfile(response.profile || {});
      } catch (err) {
        console.error('Profile error:', err);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-text flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-hacker-accent mb-2">
              Welcome, {profile?.full_name || user?.email?.split('@')[0]}!
              <span className="coding-animation">{'</>'}</span>
            </h2>
            <p className="text-hacker-muted">Submit your code for AI-powered review and help us improve AI assistance</p>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => navigate('/profile')}
            className="btn btn-primary ml-6"
            title="Go to Profile"
          >
            👤 My Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            onClick={() => setActiveTab('submit')}
            className={`tab-button ${activeTab === 'submit' ? 'active' : ''}`}
          >
            Submit Code
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          >
            Review History
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          >
            Statistics
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {activeTab === 'submit' && !selectedReview && (
            <div className="md:col-span-2">
              <CodeEditor onSubmitSuccess={(reviewData) => {
                console.log('Setting review:', reviewData);
                setSelectedReview(reviewData);
                setActiveTab('submit');
              }} />
            </div>
          )}

          {activeTab === 'submit' && selectedReview && (
            <div className="md:col-span-2">
              <ResultsDisplay 
                review={selectedReview}
                onClose={() => setSelectedReview(null)}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="md:col-span-2">
              <ReviewHistory />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="md:col-span-2">
              <Statistics />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
