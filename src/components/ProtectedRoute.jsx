import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.banned) {
    return (
      <div className="page">
        <h1>Account Suspended</h1>
        <p>Your account has been suspended. Please contact support.</p>
      </div>
    );
  }
  return children;
}

export function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  if (user.banned) return <Navigate to="/" replace />;
  return children;
}