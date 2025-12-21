import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/homePage';
import Dashboard from './pages/dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import GoogleCallback from './pages/GoogleCallback';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: '#667eea',
      marginBottom: '0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/home" style={{
          textDecoration: 'none',
          color: 'white',
          fontWeight: '600',
          fontSize: '1.1rem',
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Home
        </Link>
        <Link to="/dashboard" style={{
          textDecoration: 'none',
          color: 'white',
          fontWeight: '600',
          fontSize: '1.1rem',
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Dashboard
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span style={{ color: 'white', fontSize: '0.95rem' }}>
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" style={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              Sign In
            </Link>
            <Link to="/signup" style={{
              padding: '8px 20px',
              backgroundColor: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show navigation on landing, signin, and signup pages
  const hideNavigation = ['/', '/signin', '/signup'].includes(location.pathname) && !isAuthenticated;

  return (
    <>
      {!hideNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />
        } />
        <Route path="/signin" element={
          isAuthenticated ? <Navigate to="/home" replace /> : <SignIn />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/home" replace /> : <SignUp />
        } />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
