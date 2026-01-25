import { useState, useEffect } from 'react';
import { feedbackAPI } from '../../services/api';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await feedbackAPI.getStatistics();
      setStats(response.statistics);
    } catch (err) {
      setError(err.error || 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-hacker-success';
    if (score >= 6) return 'text-hacker-warning';
    return 'text-hacker-danger';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-hacker-success bg-opacity-10 border-hacker-success';
    if (score >= 6) return 'bg-hacker-warning bg-opacity-10 border-hacker-warning';
    return 'bg-hacker-danger bg-opacity-10 border-hacker-danger';
  };

  if (isLoading) {
    return (
      <div className="card text-center">
        <p className="text-hacker-accent">⏳ Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-danger">{error}</div>
        <button
          onClick={loadStatistics}
          className="btn btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats || stats.total_feedback === 0) {
    return (
      <div className="card text-center">
        <p className="text-hacker-muted text-lg">
           No feedback data yet. Submit reviews and provide feedback to see statistics!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h3 className="text-2xl font-bold text-hacker-accent mb-2">
           $ ./  Research Statistics
        </h3>
        <p className="text-hacker-muted">
          Based on {stats.total_feedback} feedback submission{stats.total_feedback !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Accuracy */}
        <div className={`card border-2 border-l-4 ${getScoreBg(stats.average_accuracy)}`}>
          <p className="text-hacker-muted text-sm mb-2"> [%] Average Accuracy</p>
          <p className={`text-5xl font-bold ${getScoreColor(stats.average_accuracy)}`}>
            {stats.average_accuracy.toFixed(1)}
            <span className="text-lg">/10</span>
          </p>
          <p className="text-hacker-muted text-xs mt-2">
            How accurate was the AI analysis?
          </p>
        </div>

        {/* Helpfulness */}
        <div className={`card border-2 border-l-4 ${getScoreBg(stats.average_helpfulness)}`}>
          <p className="text-hacker-muted text-sm mb-2"> [+] Average Helpfulness</p>
          <p className={`text-5xl font-bold ${getScoreColor(stats.average_helpfulness)}`}>
            {stats.average_helpfulness.toFixed(1)}
            <span className="text-lg">/10</span>
          </p>
          <p className="text-hacker-muted text-xs mt-2">
            How helpful were the suggestions?
          </p>
        </div>

        {/* Trust */}
        <div className={`card border-2 border-l-4 ${getScoreBg(stats.average_trust)}`}>
          <p className="text-hacker-muted text-sm mb-2"> [#] Average Trust</p>
          <p className={`text-5xl font-bold ${getScoreColor(stats.average_trust)}`}>
            {stats.average_trust.toFixed(1)}
            <span className="text-lg">/10</span>
          </p>
          <p className="text-hacker-muted text-xs mt-2">
            How much do you trust the feedback?
          </p>
        </div>

        {/* Time */}
        <div className="card border-2 border-l-4 bg-hacker-accent bg-opacity-10 border-hacker-accent">
          <p className="text-hacker-muted text-sm mb-2"> [~] Average Review Time</p>
          <p className="text-5xl font-bold text-hacker-accent">
            {Math.round(stats.average_time_spent)}
            <span className="text-lg">s</span>
          </p>
          <p className="text-hacker-muted text-xs mt-2">
            Average seconds spent per review
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="card">
        <h4 className="text-lg font-bold text-hacker-accent mb-4"> [#] Summary</h4>
        <div className="space-y-3 text-hacker-muted">
          <p>
            ✓ Based on <span className="text-hacker-accent font-bold">{stats.total_feedback}</span> feedback submissions
          </p>
          <p>
            ✓ Average accuracy of <span className="text-hacker-accent font-bold">{stats.average_accuracy.toFixed(1)}/10</span> indicates the AI analysis is {
              stats.average_accuracy >= 8 ? 'highly accurate' :
              stats.average_accuracy >= 6 ? 'reasonably accurate' :
              'needs improvement'
            }
          </p>
          <p>
            ✓ Average helpfulness of <span className="text-hacker-accent font-bold">{stats.average_helpfulness.toFixed(1)}/10</span> shows users find the suggestions {
              stats.average_helpfulness >= 8 ? 'very helpful' :
              stats.average_helpfulness >= 6 ? 'moderately helpful' :
              'somewhat helpful'
            }
          </p>
          <p>
            ✓ Users spend approximately <span className="text-hacker-accent font-bold">{Math.round(stats.average_time_spent)} seconds</span> reviewing code
          </p>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadStatistics}
        className="btn btn-primary w-full"
      >
        🔄 Refresh Statistics
      </button>
    </div>
  );
}