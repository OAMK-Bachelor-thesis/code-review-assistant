import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-text">
      {/* Navbar */}
      <nav className="bg-hacker-surface border-b border-hacker-accent border-opacity-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-hacker-accent">
            &gt; CODE_REVIEW
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-hacker-muted">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="card text-center">
          <h2 className="text-3xl font-bold text-hacker-accent mb-4">
            Dashboard
          </h2>
          <p className="text-hacker-muted mb-6">
            Week 5 Step 2 & beyond will add:
          </p>
          <ul className="text-left inline-block text-hacker-text space-y-2">
            <li>✅ Code submission form</li>
            <li>✅ AI analysis results display</li>
            <li>✅ Feedback collection</li>
            <li>✅ Review history</li>
            <li>✅ Statistics dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
