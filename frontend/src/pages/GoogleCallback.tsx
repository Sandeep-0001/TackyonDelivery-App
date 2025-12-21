import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google authentication error:', error);
      navigate('/signin?error=' + error);
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Update auth context
        login(token, user);
        
        // Redirect to home
        navigate('/home');
      } catch (err) {
        console.error('Error parsing user data:', err);
        navigate('/signin?error=invalid_data');
      }
    } else {
      navigate('/signin?error=missing_credentials');
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '20px'
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Completing Sign In...</h2>
        <p style={{ opacity: 0.9 }}>Please wait while we authenticate your account</p>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GoogleCallback;
