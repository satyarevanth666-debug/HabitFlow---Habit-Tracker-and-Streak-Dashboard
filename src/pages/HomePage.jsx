import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HabitContext } from '../context/HabitContext';
import { getStreakEmoji, getStreakStatus } from '../utils/streakUtils';
import '../styles/pages/HomePage.css';

export const HomePage = () => {
  const navigate = useNavigate();
  const { habits, getOverallStats } = useContext(HabitContext);
  const stats = getOverallStats();
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [displayedCheckIns, setDisplayedCheckIns] = useState(0);

  useEffect(() => {
    setTotalCheckIns(stats.totalCheckIns);
  }, [stats.totalCheckIns]);

  useEffect(() => {
    if (displayedCheckIns < totalCheckIns) {
      const timer = setTimeout(() => {
        setDisplayedCheckIns(prev => Math.min(prev + 10, totalCheckIns));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [displayedCheckIns, totalCheckIns]);

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="hero-section">
          <div className="hero-left">
            <h1 className="hero-title">
              Build Better Habits.
              <br />
              <span className="gradient-text">One Day At A Time.</span>
            </h1>
            <p className="hero-subtitle">
              Track consistency, build streaks, and become your best self. HabitFlow makes it simple to develop the habits that matter most.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="stat-number">{stats.totalHabits}</div>
                <div className="stat-label">Active Habits</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number">{stats.completionRate}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number">
                  <span className="streak-emoji">{getStreakEmoji(stats.currentStreak)}</span>
                  {stats.currentStreak}
                </div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>

            <button className="cta-button" onClick={() => navigate('/dashboard')}>
              Begin Tracking →
            </button>
          </div>

          <div className="hero-right">
            <div className="floating-illustration">
              <div className="illustration-circle">
                <svg viewBox="0 0 200 200" className="illustration-svg">
                  {/* Rocket */}
                  <circle cx="100" cy="100" r="80" fill="#1e293b" opacity="0.5" />
                  <path d="M 100 50 L 110 100 L 100 110 L 90 100 Z" fill="#8b5cf6" />
                  <rect x="85" y="110" width="30" height="40" fill="#06b6d4" rx="5" />
                  <circle cx="85" cy="130" r="5" fill="#ef4444" />
                  <circle cx="115" cy="130" r="5" fill="#ef4444" />
                  
                  {/* Flame */}
                  <path d="M 80 155 Q 75 165 80 175 Q 85 165 80 155" fill="#f59e0b" opacity="0.8" />
                  <path d="M 100 155 Q 95 165 100 175 Q 105 165 100 155" fill="#f59e0b" opacity="0.8" />
                  <path d="M 120 155 Q 115 165 120 175 Q 125 165 120 155" fill="#f59e0b" opacity="0.8" />

                  {/* Stars */}
                  <circle cx="40" cy="40" r="3" fill="#fbbf24" />
                  <circle cx="160" cy="50" r="2" fill="#fbbf24" />
                  <circle cx="170" cy="120" r="2.5" fill="#fbbf24" />
                  <circle cx="30" cy="140" r="2" fill="#fbbf24" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="global-counter">
          <div className="counter-content">
            <div className="counter-label">Total Check-ins Logged</div>
            <div className="counter-value">{displayedCheckIns.toLocaleString()}</div>
            <p className="counter-description">Everyone using HabitFlow is building consistency together</p>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title">Why Choose HabitFlow?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Everything</h3>
              <p>Monitor your daily progress with detailed analytics and insights about your habits.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>Build Streaks</h3>
              <p>Visualize your consistency and watch your streaks grow. Never break a chain!</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>See Progress</h3>
              <p>View beautiful heatmaps and completion rates. Celebrate your momentum.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Stay Focused</h3>
              <p>Use the built-in Pomodoro timer to stay productive and track focus time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❄️</div>
              <h3>Freeze Tokens</h3>
              <p>Protect your streak when life gets hectic. Use your weekly freeze token wisely.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Local Storage</h3>
              <p>All your data stays on your device. No account needed, pure privacy.</p>
            </div>
          </div>
        </div>

        <div className="motivation-section">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">A fast, modern flow for turning habits into momentum.</p>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-text">
                <h4>Create Habits</h4>
                <p>Pick the daily habits and outcomes that matter most.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-text">
                <h4>Daily Check-ins</h4>
                <p>Tap complete each day to keep your routine visible.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-text">
                <h4>Build Streaks</h4>
                <p>Track your momentum and see the streaks stack up.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-text">
                <h4>Stay Motivated</h4>
                <p>Use smart insights to improve and stay on track.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
