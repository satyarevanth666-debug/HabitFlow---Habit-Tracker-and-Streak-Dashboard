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

  useEffect(() => setTotalCheckIns(stats.totalCheckIns), [stats.totalCheckIns]);

  useEffect(() => {
    if (displayedCheckIns < totalCheckIns) {
      const timer = setTimeout(() => setDisplayedCheckIns(prev => Math.min(prev + 10, totalCheckIns)), 18);
      return () => clearTimeout(timer);
    }
  }, [displayedCheckIns, totalCheckIns]);

  return (
    <main className="home-page" aria-label="Home">
      <div className="home-content">
        <header className="hero-section" role="banner">
          <div className="hero-container">
            <div className="hero-left">
              <div className="eyebrow">✨ Calm, motivating, and built for consistency</div>
              <h1 className="hero-title">
                Build better habits
                <span className="dot">.</span>
                <br />
                <span className="gradient-text">Make progress delightfully simple.</span>
              </h1>

              <p className="hero-subtitle">Keep streaks, focus deeply, and see clear progress — all locally on your device.</p>

              <nav className="hero-actions" aria-label="Primary actions">
                <button className="cta-button" onClick={() => navigate('/dashboard')}>Start Tracking</button>
                <button className="secondary-button" onClick={() => navigate('/habits')}>View Habits</button>
              </nav>

              <div className="hero-stats" role="list" aria-label="Summary stats">
                <div className="hero-stat" role="listitem">
                  <div className="stat-number">{stats.totalHabits}</div>
                  <div className="stat-label">Active Habits</div>
                </div>
                <div className="hero-stat" role="listitem">
                  <div className="stat-number">{stats.completionRate}%</div>
                  <div className="stat-label">Completion Rate</div>
                </div>
                <div className="hero-stat" role="listitem">
                  <div className="stat-number"><span className="streak-emoji">{getStreakEmoji(stats.currentStreak)}</span>{stats.currentStreak}</div>
                  <div className="stat-label">Current Streak</div>
                </div>
              </div>
            </div>

            <aside className="hero-right" aria-hidden="false">
              <div className="preview-card">
                <div className="preview-top">
                  <div className="preview-title">Today</div>
                  <div className="preview-sub">{displayedCheckIns.toLocaleString()} check-ins</div>
                </div>
                <div className="preview-body">
                  <div className="mini-stat">
                    <div className="mini-label">Focus</div>
                    <div className="mini-value">25m</div>
                  </div>
                  <div className="mini-stat">
                    <div className="mini-label">Completed</div>
                    <div className="mini-value">3</div>
                  </div>
                  <div className="mini-stat">
                    <div className="mini-label">Streak</div>
                    <div className="mini-value">{stats.currentStreak}</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <section className="features-section" aria-label="Features">
          <div className="section-heading">
            <div className="section-pill">Why it stands out</div>
            <h2 className="section-title">Delightful tools for daily consistency</h2>
            <p className="section-subtitle">Everything you need to turn small actions into lasting routines.</p>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Clear Progress</h3>
              <p>Daily snapshots and weekly trends that make progress obvious at a glance.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>Meaningful Streaks</h3>
              <p>Small wins become momentum — protect them with smart freeze tokens.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Built-in Focus</h3>
              <p>Pomodoro timer and distraction-free check-ins to protect your most productive time.</p>
            </article>
          </div>
        </section>

        <section className="showcase-section" aria-label="App showcase">
          <div className="showcase-inner">
            <div className="showcase-left">
              <h3>See your day at a glance</h3>
              <p className="muted">A tidy, scannable layout makes it easy to keep momentum without friction.</p>
              <button className="cta-button" onClick={() => navigate('/dashboard')}>Open Dashboard</button>
            </div>
            <div className="showcase-right">
              <div className="mock-habit-list">
                <div className="mock-habit">Morning run <span className="pill done">✓</span></div>
                <div className="mock-habit">Read 20 pages <span className="pill done">✓</span></div>
                <div className="mock-habit">Practice piano <span className="pill">—</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-banner" aria-label="Call to action">
          <div className="cta-inner">
            <div>
              <h2>Ready to make consistency easier?</h2>
              <p className="muted">Start tracking today — no account required.</p>
            </div>
            <div>
              <button className="cta-button" onClick={() => navigate('/dashboard')}>Get Started</button>
              <button className="secondary-button" onClick={() => navigate('/about')}>Learn More</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
