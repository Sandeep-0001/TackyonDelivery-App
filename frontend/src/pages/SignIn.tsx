import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await signIn(email, password);
      
      // Update auth context immediately
      login(response.token, response.user);
      
      // Redirect to home page
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-card-body">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="Company logo"
              className="mx-auto h-11 w-11 rounded-2xl bg-white object-contain shadow-sm"
            />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-600">Sign in to your RouteOptimizer account</p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="text-xs font-medium text-slate-500">OR</div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleSignInButton />

          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-brand-primary-700 hover:text-brand-primary-800">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
