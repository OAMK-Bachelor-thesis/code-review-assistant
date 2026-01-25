import { useState, useEffect } from 'react';
import FeedbackForm from './FeedbackForm';
import { feedbackAPI } from '../../services/api';

export default function ResultsDisplay({ review, onClose }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);

  // Load existing feedback when component mounts
    useEffect(() => {
    const loadFeedback = async () => {
      try {
        const response = await feedbackAPI.getFeedback(review.id);
        console.log('Loaded feedback response:', response);
        console.log('Feedback object:', response.feedback);  // Add this line
        const feedback = response.feedback || response;
        console.log('Final feedback to display:', feedback);  // Add this line
        setExistingFeedback(feedback);
      } catch (err) {
        console.log('No feedback found:', err);
        setExistingFeedback(null);
      } finally {
        setIsLoadingFeedback(false);
      }
    } ;
    
    loadFeedback();
  }, [review.id]);

  console.log('ResultsDisplay review:', review);
  if (!review) {
    return null;
  }

  const analysis = review.analysis?.analysis || review.analysis || {};
  const issues = analysis.issues || [];
  const positives = analysis.positives || [];

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
        return 'text-hacker-danger';
      case 'MEDIUM':
        return 'text-hacker-warning';
      case 'LOW':
        return 'text-hacker-success';
      default:
        return 'text-hacker-muted';
    }
  };

  const getSeverityBgColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
        return 'bg-hacker-danger bg-opacity-10 border-hacker-danger';
      case 'MEDIUM':
        return 'bg-hacker-warning bg-opacity-10 border-hacker-warning';
      case 'LOW':
        return 'bg-hacker-success bg-opacity-10 border-hacker-success';
      default:
        return 'bg-hacker-surface border-hacker-accent';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-hacker-accent mb-2">
              {review.title}
            </h3>
            <p className="text-hacker-muted">
              Language: <span className="text-hacker-text font-mono">{review.language}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            [&lt;] Back
          </button>
        </div>
      </div>

      {/* Code Preview Section */}
      <div className="card">
        <button
          onClick={() => setShowCode(!showCode)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'left',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <h4 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--success)',
            margin: 0
          }}>
            <span style={{ fontFamily: 'monospace', fontSize: '1.25rem' }}>&lt;/&gt;</span>
            <span>Submitted Code</span>
          </h4>
          <span style={{ color: 'var(--success)', fontSize: '1.25rem' }}>
            {showCode ? '[v]' : '[>]'}
          </span>
        </button>
        
        {showCode && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              backgroundColor: '#000000',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(0, 255, 65, 0.3)',
              overflowX: 'auto'
            }}>
              <pre style={{
                color: 'var(--success)',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                margin: 0
              }}>
                <code>{review.code_snippet}</code>
              </pre>
            </div>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem', 
              marginTop: '0.5rem' 
            }}>
              {review.code_snippet?.length || 0} characters
            </p>
          </div>
        )}
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-hacker-muted text-sm mb-2">Overall Score</p>
          <p className="text-4xl font-bold text-hacker-accent">
            {analysis.score || 0}
            <span className="text-lg">/100</span>
          </p>
        </div>
        <div className="card text-center">
          <p className="text-hacker-muted text-sm mb-2">Issues Found</p>
          <p className="text-4xl font-bold text-hacker-danger">
            {issues.length}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-hacker-muted text-sm mb-2">Strengths</p>
          <p className="text-4xl font-bold text-hacker-success">
            {positives.length}
          </p>
        </div>
      </div>

      {/* Summary */}
      {analysis.summary && (
        <div className="card">
          <h4 className="text-lg font-bold text-hacker-accent mb-3">[#] Summary</h4>
          <p className="text-hacker-text leading-relaxed">
            {analysis.summary}
          </p>
        </div>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-bold text-hacker-accent mb-4">
            [!] Issues Found ({issues.length})
          </h4>
          <div className="space-y-4">
            {issues.map((issue, idx) => (
              <div
                key={idx}
                className={`p-4 border border-l-4 rounded ${getSeverityBgColor(issue.severity)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-bold ${getSeverityColor(issue.severity)}`}>
                    {issue.severity?.toUpperCase()}
                  </span>
                  <span className="badge" style={{
                    backgroundColor: issue.severity?.toUpperCase() === 'HIGH' ? 'var(--danger)' :
                                     issue.severity?.toUpperCase() === 'MEDIUM' ? 'var(--warning)' :
                                     'var(--success)',
                    color: 'white'
                  }}>
                    {issue.category || 'CODE_QUALITY'}
                  </span>
                </div>
                <p className="text-hacker-text font-medium mb-2">
                  {issue.issue}
                </p>
                <p className="text-hacker-muted text-sm mb-3">
                  {issue.suggestion}
                </p>
                {issue.example && (
                  <div className="bg-black bg-opacity-50 p-3 rounded border border-hacker-accent border-opacity-20 mt-2">
                    <p className="text-hacker-accent text-xs font-mono">
                      {issue.example}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positives */}
      {positives.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-bold text-hacker-success mb-4">
            [+] Strengths ({positives.length})
          </h4>
          <ul className="space-y-2">
            {positives.map((positive, idx) => (
              <li key={idx} className="flex gap-3 text-hacker-text">
                <span className="text-hacker-success">[*]</span>
                <span>{positive}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feedback Section */}
      {isLoadingFeedback ? (
        <div className="card text-center">
          <p className="text-hacker-muted">[...] Loading feedback...</p>
        </div>
      ) : existingFeedback ? (
        // Show existing feedback
        <div className="card">
          <h4 className="text-lg font-bold text-hacker-success mb-4">
            [+] Your Feedback
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center" style={{ maxWidth: '300px' }}>
              <span className="text-hacker-text">Accuracy:</span>
              <span className="text-hacker-accent font-bold">{existingFeedback.accuracy}/10</span>
            </div>
            <div className="flex justify-between items-center" style={{ maxWidth: '300px' }}>
              <span className="text-hacker-text">Helpfulness:</span>
              <span className="text-hacker-accent font-bold">{existingFeedback.helpfulness}/10</span>
            </div>
            <div className="flex justify-between items-center" style={{ maxWidth: '300px' }}>
              <span className="text-hacker-text">Trust:</span>
              <span className="text-hacker-accent font-bold">{existingFeedback.trust}/10</span>
            </div>
            <div className="flex justify-between items-center" style={{ maxWidth: '300px' }}>
              <span className="text-hacker-text">Time Spent:</span>
              <span className="text-hacker-accent font-bold">{existingFeedback.time_spent}s</span>
            </div>
            {existingFeedback.comments && (
              <div className="mt-4 p-3 bg-hacker-bg rounded border border-hacker-accent border-opacity-20">
                <p className="text-hacker-muted text-sm font-bold mb-1">Comments:</p>
                <p className="text-hacker-text">{existingFeedback.comments}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Show feedback form
        <>
          {!showFeedback && (
            <button
              onClick={() => setShowFeedback(true)}
              className="btn btn-primary w-full"
            >
              &gt;_ Submit Your Feedback
            </button>
          )}

          {showFeedback && (
            <FeedbackForm
              reviewId={review.id}
              onSuccess={() => {
                setShowFeedback(false);
                // Reload feedback to show the submitted data
                feedbackAPI.getFeedback(review.id)
                  .then(feedback => setExistingFeedback(feedback))
                  .catch(() => {});
                alert('[+] Thank you for your feedback!');
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
