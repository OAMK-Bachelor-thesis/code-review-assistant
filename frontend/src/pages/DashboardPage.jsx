import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Layout/Navbar';
import { useState } from 'react';
import CodeEditor from '../components/CodeSubmission/CodeEditor';
import ResultsDisplay from '../components/CodeSubmission/ResultsDisplay';
import ReviewHistory from '../components/CodeSubmission/ReviewHistory';


export default function DashboardPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('submit');
  const [selectedReview, setSelectedReview] = useState(null);

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-text flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-hacker-accent mb-2">
            Welcome, {user?.email}! 👨‍💻
          </h2>
          <p className="text-hacker-muted">Submit your code for AI-powered review</p>
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
                setActiveTab('submit'); // Stay on same tab
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
              <div className="card">
                <h3 className="text-xl font-bold text-hacker-accent mb-4">
                  Your Statistics
                </h3>
                <p className="text-hacker-muted mb-4">
                  Coming in Step 2: Show research metrics
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}