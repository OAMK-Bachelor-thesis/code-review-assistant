import { useState, useEffect } from 'react';
import { reviewAPI } from '../../services/api';
import ResultsDisplay from './ResultsDisplay';

export default function ReviewHistory() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);

  const LIMIT = 10;

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await reviewAPI.getReviews(page, LIMIT);
        setReviews(response.reviews || []);
        setPagination(response.pagination || {});
      } catch (err) {
        setError(err.error || 'Failed to fetch reviews');
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReviews();
  }, [page]);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await reviewAPI.getReviews(page, LIMIT);
      setReviews(response.reviews || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.error || 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReview = async (reviewId) => {
  try {
    const review = await reviewAPI.getReview(reviewId);
    console.log('Fetched review data:', review);
    
    // Transform the data to match what ResultsDisplay expects
    const transformedReview = {
      ...review,
      analysis: review.ai_suggestions  // Map ai_suggestions to analysis
    };
    
    console.log('Transformed review:', transformedReview);
    setSelectedReview(transformedReview);
  } catch (err) {
    alert('[X] Failed to load review details: ' + err.error);
  }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewAPI.deleteReview(reviewId);
        setReviews(reviews.filter(r => r.id !== reviewId));
        alert('[+] Review deleted successfully');
      } catch (err) {
        alert('[X] Failed to delete review: ' + err.error);
      }
    }
  };

  // If a review is selected, show ResultsDisplay
  if (selectedReview) {
    return (
      <ResultsDisplay 
        review={selectedReview} 
        onClose={() => setSelectedReview(null)} 
      />
    );
  }

  if (isLoading && reviews.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-hacker-accent">[...] Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-danger">
          {error}
        </div>
        <button
          onClick={fetchReviews}
          className="btn btn-primary mt-4"
        >
          [&gt;] Retry
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-hacker-muted text-lg">
          [#] No reviews yet. Submit your first code for analysis!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-hacker-accent">
                <th className="px-6 py-4 text-hacker-accent font-bold text-left">Title</th>
                <th className="px-6 py-4 text-hacker-accent font-bold text-left">Language</th>
                <th className="px-6 py-4 text-hacker-accent font-bold text-center">Score</th>
                <th className="px-6 py-4 text-hacker-accent font-bold text-left">Date</th>
                <th className="px-6 py-4 text-hacker-accent font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr 
                  key={review.id} 
                  className="border-b border-hacker-accent border-opacity-20 hover:bg-hacker-surface hover:bg-opacity-50 transition"
                >
                  <td className="px-6 py-4 text-hacker-text font-medium">
                    {review.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge" style={{
                      backgroundColor: 'rgba(0, 255, 65, 0.2)',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      padding: '0.35rem 0.75rem'
                    }}>
                      {review.language}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold inline-block w-16" style={{
                      color: review.score >= 70 ? 'var(--success)' :
                             review.score >= 40 ? 'var(--warning)' :
                             'var(--danger)'
                    }}>
                      {review.score}/100
                    </span>
                  </td>
                  <td className="px-6 py-4 text-hacker-muted text-xs">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleViewReview(review.id)}
                        className="btn btn-secondary text-xs py-1 px-3 whitespace-nowrap"
                      >
                        &lt;/&gt; View
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="btn btn-danger text-xs py-1 px-3 whitespace-nowrap"
                      >
                        [X] Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="card flex justify-between items-center">
          <div className="text-hacker-muted">
            Page {pagination.page} of {pagination.pages} 
            ({pagination.total} total reviews)
          </div>
          <div className="space-x-2 flex">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              &lt; Previous
            </button>
            <button
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
