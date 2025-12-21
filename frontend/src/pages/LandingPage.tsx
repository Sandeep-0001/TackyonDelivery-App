import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        maxWidth: '800px'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          RouteOptimizer
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          marginBottom: '15px',
          opacity: '0.95'
        }}>
          Optimize Your Delivery Routes Efficiently
        </p>
        
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '50px',
          opacity: '0.9',
          lineHeight: '1.6'
        }}>
          Manage orders, track deliveries, and optimize routes with our powerful platform.
          Save time, reduce costs, and improve customer satisfaction.
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            to="/signin"
            style={{
              padding: '16px 40px',
              backgroundColor: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            style={{
              padding: '16px 40px',
              backgroundColor: 'transparent',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              border: '2px solid white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            Sign Up
          </Link>
        </div>

        <div style={{
          marginTop: '80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ marginBottom: '10px' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Order Management</h3>
            <p style={{ fontSize: '0.95rem', opacity: '0.9' }}>Track and manage all your orders in one place</p>
          </div>
          
          <div>
            <div style={{ marginBottom: '10px' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Route Optimization</h3>
            <p style={{ fontSize: '0.95rem', opacity: '0.9' }}>Find the most efficient delivery routes</p>
          </div>
          
          <div>
            <div style={{ marginBottom: '10px' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
                <path d="M3 3V21H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 9L13 14L9 10L3 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Analytics Dashboard</h3>
            <p style={{ fontSize: '0.95rem', opacity: '0.9' }}>Monitor performance with detailed statistics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
