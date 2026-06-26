import React from 'react';
import '../styles/pages/AboutPage.css';

export const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <h1>About HabitFlow</h1>
          <p>Your personal habit tracking companion</p>
        </div>

        <section className="about-section">
          <h2>What is HabitFlow?</h2>
          <p>
            HabitFlow is a modern, lightweight habit tracking application designed to help you build better habits and maintain consistency. Built with React and powered by LocalStorage, HabitFlow keeps all your data private and always accessible.
          </p>
          <p>
            The application is designed with a focus on simplicity and effectiveness. Track your daily habits, visualize your progress with beautiful heatmaps, and stay motivated through streaks and analytics.
          </p>
        </section>

        <section className="about-section">
          <h2>Key Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>📝 Create & Manage Habits</h3>
              <p>Easily create, edit, and organize habits by category. Add descriptions and choose from multiple color tags.</p>
            </div>
            <div className="feature-item">
              <h3>✓ Daily Check-ins</h3>
              <p>Mark habits as complete each day. See your progress instantly update across all analytics.</p>
            </div>
            <div className="feature-item">
              <h3>🔥 Streak Tracking</h3>
              <p>Track your current and longest streaks. Build consistency and watch your numbers grow.</p>
            </div>
            <div className="feature-item">
              <h3>📊 Analytics Dashboard</h3>
              <p>View detailed insights about your habits including completion rates, trends, and momentum scores.</p>
            </div>
            <div className="feature-item">
              <h3>🎨 GitHub-Style Heatmap</h3>
              <p>Visualize your 30-day consistency with an interactive heatmap. Filter by category and hover for details.</p>
            </div>
            <div className="feature-item">
              <h3>🍅 Pomodoro Timer</h3>
              <p>Built-in Pomodoro timer to help you stay focused. Track focus time for each habit.</p>
            </div>
            <div className="feature-item">
              <h3>❄️ Freeze Tokens</h3>
              <p>Protect your streak when life gets busy. One token per week to save your progress.</p>
            </div>
            <div className="feature-item">
              <h3>💾 Local Storage</h3>
              <p>All your data is stored locally on your device. No account, no cloud, pure privacy.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Tech Stack</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <h4>Frontend</h4>
              <ul>
                <li>ReactJS - UI library</li>
                <li>React Hooks - State management</li>
                <li>React Router - Navigation</li>
                <li>CSS3 - Styling & Animations</li>
              </ul>
            </div>
            <div className="tech-item">
              <h4>Storage</h4>
              <ul>
                <li>Browser LocalStorage API</li>
                <li>JSON serialization</li>
                <li>Client-side persistence</li>
              </ul>
            </div>
            <div className="tech-item">
              <h4>Design</h4>
              <ul>
                <li>Mobile-first approach</li>
                <li>Glassmorphism design</li>
                <li>Light and dark theme support</li>
                <li>Responsive CSS Grid</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>What I Learned Building This</h2>
          <div className="learnings">
            <div className="learning-item">
              <h4>⚛️ React Hooks Mastery</h4>
              <p>Deep understanding of useState, useContext, useEffect, and custom hooks for state management.</p>
            </div>
            <div className="learning-item">
              <h4>🎯 Component Architecture</h4>
              <p>Building reusable, composable components with proper separation of concerns and data flow.</p>
            </div>
            <div className="learning-item">
              <h4>📦 State Management</h4>
              <p>Managing complex application state without external libraries using Context API and custom hooks.</p>
            </div>
            <div className="learning-item">
              <h4>🗄️ LocalStorage Best Practices</h4>
              <p>Efficient data persistence, serialization, and synchronization with browser storage.</p>
            </div>
            <div className="learning-item">
              <h4>📅 Date & Time Handling</h4>
              <p>Complex date calculations, streak logic, and temporal data management in JavaScript.</p>
            </div>
            <div className="learning-item">
              <h4>🎨 Advanced CSS</h4>
              <p>CSS Grid, Flexbox, animations, transitions, responsive design, and glassmorphism effects.</p>
            </div>
            <div className="learning-item">
              <h4>🛣️ React Router</h4>
              <p>Multi-page navigation, route parameters, programmatic navigation, and history management.</p>
            </div>
            <div className="learning-item">
              <h4>📱 Responsive Design</h4>
              <p>Mobile-first approach with CSS media queries and flexible layouts for all screen sizes.</p>
            </div>
            <div className="learning-item">
              <h4>⚡ Performance Optimization</h4>
              <p>Efficient rendering, memoization, and optimization techniques for smooth user experience.</p>
            </div>
            <div className="learning-item">
              <h4>🎭 UI/UX Principles</h4>
              <p>Modern design patterns, user experience considerations, and visual feedback mechanisms.</p>
            </div>
          </div>
        </section>

        <section className="about-section funny-section">
          <h2>🤣 Developer Confessions</h2>
          <div className="confessions">
            <p>
              "I spent more time debugging JavaScript dates than actually tracking habits. Did you know Date('2026-06-26') and new Date('2026-06-26T00:00:00') behave differently across browsers? 
              <strong>They do. It's fun.</strong>"
            </p>
            <p>
              "At some point, I questioned why I was building a habit tracker when I clearly need a debugging tracker first."
            </p>
            <p>
              "CSS Grid layout is beautiful until you try to make it responsive. Then it's just... a lot of media queries."
            </p>
            <p>
              "I named this app 'HabitFlow' because my habits definitely don't flow. But maybe they will now? 🤞"
            </p>
            <p>
              "LocalStorage: when you want to store data forever but only on this specific browser on this specific device. Perfect for tracking habits you'll forget about next week!"
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>How to Use HabitFlow</h2>
          <div className="usage-steps">
            <div className="step">
              <div className="step-icon">1</div>
              <div className="step-content">
                <h4>Create Your First Habit</h4>
                <p>Go to "My Habits" and click "Create Habit". Fill in the details and choose a category, color, and frequency.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">2</div>
              <div className="step-content">
                <h4>Check In Daily</h4>
                <p>Visit the Dashboard each day and mark your habits as complete. Build those streaks!</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">3</div>
              <div className="step-content">
                <h4>Track Your Progress</h4>
                <p>Head to Insights to see detailed analytics, heatmaps, and your trending habits.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">4</div>
              <div className="step-content">
                <h4>Use Power-Ups</h4>
                <p>Leverage the Pomodoro timer for focus time and freeze tokens to protect your streaks.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Privacy & Data</h2>
          <p>
            HabitFlow is completely privacy-focused. All your data is stored locally in your browser using LocalStorage. 
            No data is sent to any server, no tracking, no analytics. Your habits remain entirely yours.
          </p>
          <p>
            <strong>Your data is yours:</strong> You can export, backup, or clear it anytime from the settings.
          </p>
        </section>

        <div className="about-footer">
          <h2>Ready to Build Better Habits?</h2>
          <p>Start tracking today and watch your consistency grow.</p>
          <a href="/dashboard" className="cta-button">Go to Dashboard →</a>
        </div>
      </div>
    </div>
  );
};
