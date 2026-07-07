import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HabitContext } from '../context/HabitContext';
import { getStreakEmoji } from '../utils/streakUtils';
import '../styles/pages/HomePage.css';

export const HomePage = () => {
  const navigate = useNavigate();
  const { getOverallStats } = useContext(HabitContext);
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
        <section className="hero-section">
          <div className="hero-left">
            <div className="eyebrow">✨ Calm, motivating, and built for consistency</div>
            <h1 className="hero-title">
              Build Better Habits.
              <br />
              <span className="gradient-text">One Day At A Time.</span>
            </h1>
            <p className="hero-subtitle">
              Turn your goals into a beautiful routine with streaks, focus tools, and insights that make progress feel effortless.
            </p>

            <div className="hero-badges">
              <span>✓ No signup required</span>
              <span>✓ Offline-friendly</span>
              <span>✓ Beautiful daily insights</span>
            </div>

            <div className="hero-actions">
              <button className="cta-button" onClick={() => navigate('/dashboard')}>
                Begin Tracking →
              </button>
              <button className="secondary-button" onClick={() => navigate('/insights')}>
                Explore Insights
              </button>
            </div>

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
          </div>

          <div className="hero-right">
            <div className="floating-illustration">
              <div className="illustration-card">
                <div className="mini-pill">Momentum snapshot</div>
                <div className="snapshot-row">
                  <span>Today</span>
                  <strong>3 habits completed</strong>
                </div>
                <div className="snapshot-row">
                  <span>Focus</span>
                  <strong>25 min deep work</strong>
                </div>
                <div className="snapshot-row">
                  <span>Streak</span>
                  <strong>+{stats.currentStreak} days</strong>
                </div>
              </div>
              <div className="illustration-circle">
                <svg viewBox="0 0 200 200" className="illustration-svg">
                  <circle cx="100" cy="100" r="80" fill="#1e293b" opacity="0.45" />
                  <path d="M 100 50 L 110 100 L 100 110 L 90 100 Z" fill="#8b5cf6" />
                  <rect x="85" y="110" width="30" height="40" fill="#06b6d4" rx="5" />
                  <circle cx="85" cy="130" r="5" fill="#ef4444" />
                  <circle cx="115" cy="130" r="5" fill="#ef4444" />
                  <path d="M 80 155 Q 75 165 80 175 Q 85 165 80 155" fill="#f59e0b" opacity="0.8" />
                  <path d="M 100 155 Q 95 165 100 175 Q 105 165 100 155" fill="#f59e0b" opacity="0.8" />
                  <path d="M 120 155 Q 115 165 120 175 Q 125 165 120 155" fill="#f59e0b" opacity="0.8" />
                  <circle cx="40" cy="40" r="3" fill="#fbbf24" />
                  <circle cx="160" cy="50" r="2" fill="#fbbf24" />
                  <circle cx="170" cy="120" r="2.5" fill="#fbbf24" />
                  <circle cx="30" cy="140" r="2" fill="#fbbf24" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="global-counter">
          <div className="counter-content">
            <div className="counter-label">Total Check-ins Logged</div>
            <div className="counter-value">{displayedCheckIns.toLocaleString()}</div>
            <p className="counter-description">Every small win adds up when you track it beautifully.</p>
          </div>
        </section>

        <section className="features-section">
          <div className="section-heading">
            <div className="section-pill">Why it stands out</div>
            <h2 className="section-title">Everything you need to stay consistent</h2>
            <p className="section-subtitle">A polished experience that turns everyday habit building into something motivating and rewarding.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Everything</h3>
              <p>Keep your routines visible with bright, clear progress and daily momentum insights.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>Build Streaks</h3>
              <p>Watch your consistency grow and turn each completed day into a meaningful win.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>See Progress</h3>
              <p>Enjoy vivid analytics and a calm visual flow that makes improvement easy to understand.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Stay Focused</h3>
              <p>Use the built-in Pomodoro timer to stay productive and protect your energy.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❄️</div>
              <h3>Freeze Tokens</h3>
              <p>Protect your streak when life gets heavy with a smart weekly safeguard.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Local Storage</h3>
              <p>Your data stays on your device, so your progress feels private and secure.</p>
            </div>
          </div>
        </section>

        <section className="motivation-section">
          <div className="section-heading">
            <div className="section-pill">How it works</div>
            <h2 className="section-title">A simple flow that keeps you moving</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-text">
                <h4>Create Habits</h4>
                <p>Pick the routines and outcomes that matter most and shape your focus.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-text">
                <h4>Daily Check-ins</h4>
                <p>Tap complete each day and let your progress stay visible in real time.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-text">
                <h4>Build Streaks</h4>
                <p>Watch your momentum stack up and feel the satisfaction of consistency.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-text">
                <h4>Stay Motivated</h4>
                <p>Use clear insights and focus tools to keep your routine feeling alive.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
