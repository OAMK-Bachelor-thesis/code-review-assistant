import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-hacker-surface border-b border-hacker-accent border-opacity-30 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-hacker-accent glow cursor-pointer" onClick={() => navigate('/dashboard')}>
          &gt; CODE_REVIEW
        </h1>

        {/* User Info & Logout */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-hacker-text font-medium">{user?.email}</span>
            <span className="text-hacker-muted text-sm">Developer</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}