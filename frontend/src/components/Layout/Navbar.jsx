import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-hacker-surface border-b border-hacker-accent border-opacity-30 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 
          className="text-2xl font-bold text-hacker-accent glow cursor-pointer" 
          onClick={() => navigate('/')}
        >
          &lt;/&gt; CODE_REVIEW
        </h1>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            // Logged in user view
            <>
              

              <div className="flex flex-col items-end">
                <span className="text-hacker-text font-medium text-sm">{user?.email}</span>
                <span className="text-hacker-muted text-xs">Developer</span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-danger text-sm py-2 px-3"
              >
                Logout
              </button>
            </>
          ) : (
            // Not logged in view
            <>
              <Link
                to="/login"
                className="btn btn-secondary text-sm py-2 px-4"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary text-sm py-2 px-4"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
