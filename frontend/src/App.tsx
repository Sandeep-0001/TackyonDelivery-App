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
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Company logo"
                className="h-9 w-9 rounded-xl bg-white object-contain shadow-sm"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">Tackyon  Delivery</div>
                <div className="text-xs text-slate-500">Deliver smarter</div>
              </div>
              <nav className="ml-6 hidden sm:flex items-center gap-2">
                <Link
                  to="/home"
                  className={
                    (isActive('/home')
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100') +
                    ' rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                  }
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className={
                    (isActive('/dashboard')
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100') +
                    ' rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                  }
                >
                  Dashboard
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="hidden sm:block text-sm text-slate-600">
                    <span className="text-slate-500">Signed in as</span>{' '}
                    <span className="font-medium text-slate-900">{user?.name}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="btn btn-ghost">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-2">
          <Link
            to="/home"
            className={
              (isActive('/home') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100') +
              ' rounded-lg px-3 py-2 text-sm font-medium transition-colors'
            }
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={
              (isActive('/dashboard') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100') +
              ' rounded-lg px-3 py-2 text-sm font-medium transition-colors'
            }
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
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
