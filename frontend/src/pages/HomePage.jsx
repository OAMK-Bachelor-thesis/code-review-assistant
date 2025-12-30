import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-text flex flex-col">
      {/* Navigation */}
      <nav className="bg-hacker-surface border-b border-hacker-accent border-opacity-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-hacker-accent glow">
            &gt; CODE_REVIEW
          </h1>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
<<<<<<< HEAD
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-40">
            <h1 className="text-5xl font-bold text-hacker-accent mb-6 glow">
              AI-Enhanced Code Review Assistant
            </h1>
            <p className="text-xl text-hacker-muted mb-8">
              Get intelligent, automated code reviews powered by Groq AI
=======
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-40">
          <h1 className="text-5xl font-bold text-hacker-accent mb-4 glow">
            AI-Enhanced Code Review Assistant
          </h1>
          <p className="text-xl text-hacker-muted mb-8">
            Get intelligent, automated code reviews powered by Groq AI
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
              Get Started Now
            </Link>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* Feature 1 */}
          <div className="card">
            <h3 className="text-xl font-bold text-hacker-accent mb-3">
              🤖 AI-Powered Analysis
            </h3>
            <p className="text-hacker-muted">
              Groq LLaMA 3.1 analyzes your code for security, performance, and quality issues.
>>>>>>> d53479b7dd17238110a189d19976b4e6e3e0e447
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3 inline-block">
                Get Started Now
              </Link>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card">
              <h3 className="text-xl font-bold text-hacker-accent mb-3">
                🤖 AI-Powered Analysis
              </h3>
              <p className="text-hacker-muted">
                Groq LLaMA 3.1 analyzes your code for security, performance, and quality issues.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <h3 className="text-xl font-bold text-hacker-accent mb-3">
                ⚡ Instant Feedback
              </h3>
              <p className="text-hacker-muted">
                Get comprehensive reviews in seconds with detailed suggestions for improvement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <h3 className="text-xl font-bold text-hacker-accent mb-3">
                📊 Research Metrics
              </h3>
              <p className="text-hacker-muted">
                Participate in our research to improve AI code review systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-hacker-surface border-t border-hacker-accent border-opacity-30 px-6 py-4 text-center text-hacker-muted text-sm">
        <p>&copy; 2025 Code Review Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
}