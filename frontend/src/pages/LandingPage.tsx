import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="hero-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl text-center text-white">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Route optimization • Orders • Tracking
          </div>

          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight">
            Tackyon Delivery
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-white/90">
            Optimize delivery routes, manage orders, and track progress in one place.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signin"
              className="inline-flex items-center justify-center rounded-lg bg-white text-slate-900 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-white/90 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 text-white px-5 py-3 text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              Create account
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-5">
              <div className="mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              </div>
              <div className="text-base font-semibold">Order management</div>
              <div className="mt-1 text-sm text-white/85">Track and update customer orders quickly.</div>
            </div>

            <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-5">
              <div className="mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              </div>
              <div className="text-base font-semibold">Route optimization</div>
              <div className="mt-1 text-sm text-white/85">Generate efficient routes and reduce costs.</div>
            </div>

            <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-5">
              <div className="mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 9L13 14L9 10L3 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              </div>
              <div className="text-base font-semibold">Dashboard insights</div>
              <div className="mt-1 text-sm text-white/85">See recent orders and real-time stats.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
