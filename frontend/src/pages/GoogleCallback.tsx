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
    <div className="auth-bg">
      <div className="text-center text-white">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-spin"
          >
            <path
              d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight">Completing sign in…</h2>
        <p className="mt-2 text-sm text-white/80">Please wait while we authenticate your account</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
