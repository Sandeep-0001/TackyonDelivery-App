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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        padding: '40px',
        width: '100%',
        maxWidth: '450px'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '10px',
          fontSize: '2rem'
        }}>
          Create Account
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px'
        }}>
          Sign up for RouteOptimizer
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your full name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!email || sending}
              style={{
                padding: '10px 14px',
                backgroundColor: sending ? '#999' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: sending ? 'not-allowed' : 'pointer'
              }}
            >
              {sending ? 'Sending...' : 'Send OTP'}
            </button>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {otpStatus && (
            <div style={{
              backgroundColor: '#eef6ff',
              color: '#1e60d1',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '12px',
              border: '1px solid #cfe2ff'
            }}>
              {otpStatus}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="At least 6 characters"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#999' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#5568d3';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#667eea';
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '25px 0',
          gap: '10px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
          <span style={{ color: '#666', fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
        </div>

        <GoogleSignInButton />

        <div style={{
          textAlign: 'center',
          color: '#666',
          marginTop: '25px'
        }}>
          Already have an account?{' '}
          <Link
            to="/signin"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
