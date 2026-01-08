import { useState } from 'react';
import FeedbackForm from './FeedbackForm';

export default function ResultsDisplay({ review, onClose }) {
  const [showFeedback, setShowFeedback] = useState(false);

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
            Back
          </button>
        </div>
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
          <h4 className="text-lg font-bold text-hacker-accent mb-3">📋 Summary</h4>
          <p className="text-hacker-text leading-relaxed">
            {analysis.summary}
          </p>
        </div>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-bold text-hacker-accent mb-4">
            ⚠️ Issues Found ({issues.length})
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
            ✅ Strengths ({positives.length})
          </h4>
          <ul className="space-y-2">
            {positives.map((positive, idx) => (
              <li key={idx} className="flex gap-3 text-hacker-text">
                <span className="text-hacker-success">✓</span>
                <span>{positive}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feedback Section */}
      {!showFeedback && (
        <button
          onClick={() => setShowFeedback(true)}
          className="btn btn-primary w-full"
        >
          📝 Submit Your Feedback
        </button>
      )}

      {showFeedback && (
        <FeedbackForm
          reviewId={review.id}
          onSuccess={() => {
            setShowFeedback(false);
            alert('✅ Thank you for your feedback!');
          }}
        />
      )}
    </div>
  );
}