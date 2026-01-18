import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Layout/Navbar';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-text flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="app-container text-center">

          {/* Hero Section */}
          <h1 className="text-3xl text-accent glow mb-4">
            AI-Enhanced Code Review Assistant
          </h1>

          <p className="text-muted mb-8">
            Get intelligent, automated code reviews powered by Groq AI
          </p>

          {!isAuthenticated && (
            <Link
              to="/register"
              className="btn btn-primary mb-40"
            >
              Get Started Now
            </Link>
          )}

          {/* Features */}
          <div className="grid grid-3 mt-6">
            <div className="card">
              <h3 className="text-accent mb-2">
                🤖 AI-Powered Analysis
              </h3>
              <p className="text-muted">
                Advanced AI analyzes your code for security, performance,
                and best practices.
              </p>
            </div>

            <div className="card">
              <h3 className="text-accent mb-2">
                ⚡ Instant Feedback
              </h3>
              <p className="text-muted">
                Receive detailed reviews in seconds with clear,
                actionable improvement suggestions.
              </p>
            </div>

            <div className="card">
              <h3 className="text-accent mb-2">
                📊 Research Metrics
              </h3>
              <p className="text-muted">
                Contribute to improving next-generation AI code
                review systems through real usage data.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-muted">
        © 2025 Code Review Assistant. All rights reserved.
      </footer>
    </div>
  );
}
