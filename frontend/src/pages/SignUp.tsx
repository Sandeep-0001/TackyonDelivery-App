import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp, sendEmailOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [otpStatus, setOtpStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOtp = async () => {
    try {
      setOtpStatus(null);
      setSending(true);
      await sendEmailOtp(email);
      setOtpStatus('OTP sent to email');
    } catch (err: any) {
      setOtpStatus(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!code || code.length < 4) {
      setError('Please enter the OTP sent to your email');
      return;
    }

    setLoading(true);

    try {
      const response = await signUp(name, email, password, code);
      
      // Update auth context immediately
      login(response.token, response.user);
      
      // Redirect to home page
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
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
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Create account</h1>
            <p className="mt-2 text-sm text-slate-600">Sign up for RouteOptimizer</p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!email || sending}
                className="btn btn-outline w-full sm:col-span-1"
              >
                {sending ? 'Sending…' : 'Send OTP'}
              </button>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                className="input sm:col-span-2"
                inputMode="numeric"
              />
            </div>

            {otpStatus && (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                {otpStatus}
              </div>
            )}

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="label">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="text-xs font-medium text-slate-500">OR</div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleSignInButton />

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-brand-primary-700 hover:text-brand-primary-800">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
