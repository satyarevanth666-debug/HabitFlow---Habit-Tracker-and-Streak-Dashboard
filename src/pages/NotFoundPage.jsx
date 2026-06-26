import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/NotFoundPage.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-illustration">
          <svg viewBox="0 0 200 200" className="illustration-svg">
            {/* Big 404 background */}
            <text x="100" y="120" fontSize="80" fontWeight="bold" textAnchor="middle" fill="#334155" opacity="0.3">
              404
            </text>
            
            {/* Lost rocket */}
            <circle cx="100" cy="60" r="8" fill="#8b5cf6" />
            <path d="M 100 50 L 105 75 L 100 80 L 95 75 Z" fill="#06b6d4" />
            
            {/* Floating X marks */}
            <circle cx="50" cy="50" r="15" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
            <line x1="45" y1="45" x2="55" y2="55" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
            <line x1="55" y1="45" x2="45" y2="55" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
            
            <circle cx="150" cy="70" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.7" />
            <line x1="146" y1="66" x2="154" y2="74" stroke="#f59e0b" strokeWidth="2" opacity="0.7" />
            <line x1="154" y1="66" x2="146" y2="74" stroke="#f59e0b" strokeWidth="2" opacity="0.7" />
          </svg>
        </div>

        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Oops! This page is busy building better habits.</h2>
          <p className="not-found-description">
            The page you're looking for doesn't exist or may have been moved. But that's okay! 
            Your habits are waiting on the dashboard.
          </p>

          <button className="return-home-btn" onClick={() => navigate('/')}>
            ← Return Home
          </button>

          <div className="quick-links">
            <a href="/dashboard" className="quick-link">Dashboard</a>
            <a href="/habits" className="quick-link">My Habits</a>
            <a href="/insights" className="quick-link">Insights</a>
          </div>
        </div>
      </div>
    </div>
  );
};
