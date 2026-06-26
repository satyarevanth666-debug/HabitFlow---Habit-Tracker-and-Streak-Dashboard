import React, { useContext, useState } from 'react';
import { HabitContext } from '../context/HabitContext';
import { ConsistencyGrid } from '../components/ConsistencyGrid';
import { HabitStatsCard } from '../components/HabitStatsCard';
import { 
  calculateCurrentStreak, 
  calculateLongestStreak, 
  calculateCompletionRate,
  calculateTotalCheckIns,
  findBestHabit
} from '../utils/streakUtils';
import { 
  getAverageCompletion,
  getHabitStats,
  rankHabitsByMomentum,
  getTrendingHabits,
  getStruggleHabits,
  calculateTotalFocusTime,
  formatFocusTime,
  calculateHabitMomentumScore
} from '../utils/momentumUtils';
import '../styles/pages/InsightsPage.css';

export const InsightsPage = () => {
  const { habits, pomodoroData } = useContext(HabitContext);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const CATEGORIES = ['All', 'Health', 'Fitness', 'Productivity', 'Learning', 'Finance', 'Reading', 'Custom'];

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  const totalHabits = habits.length;
  const averageCompletion = getAverageCompletion(habits);
  const totalCheckIns = calculateTotalCheckIns(habits);
  const totalFocusTime = calculateTotalFocusTime(habits);
  
  let maxCurrentStreak = 0;
  let maxLongestStreak = 0;
  habits.forEach(habit => {
    const current = calculateCurrentStreak(habit.checkIns);
    const longest = calculateLongestStreak(habit.checkIns);
    if (current > maxCurrentStreak) maxCurrentStreak = current;
    if (longest > maxLongestStreak) maxLongestStreak = longest;
  });

  const bestHabitData = findBestHabit(filteredHabits);
  const trendingHabits = getTrendingHabits(filteredHabits).slice(0, 3);
  const struggleHabits = getStruggleHabits(filteredHabits).slice(0, 3);

  const getHabitStats = (habit) => {
    return {
      name: habit.name,
      category: habit.category,
      currentStreak: calculateCurrentStreak(habit.checkIns),
      longestStreak: calculateLongestStreak(habit.checkIns),
      completionRate30: calculateCompletionRate(habit.checkIns, 30),
      completionRate7: calculateCompletionRate(habit.checkIns, 7),
      momentum: calculateHabitMomentumScore(habit)
    };
  };

  return (
    <div className="insights-page">
      <div className="insights-container">
        <div className="insights-header">
          <div>
            <h1>Insights & Analytics</h1>
            <p>Deep dive into your habit data and track your progress</p>
          </div>
        </div>

        {totalHabits === 0 ? (
          <div className="empty-insights">
            <div className="empty-icon">📊</div>
            <h2>No data to analyze yet</h2>
            <p>Create some habits and start tracking to see insights.</p>
          </div>
        ) : (
          <>
            <div className="category-filter-section">
              <div className="category-filters">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="overall-stats">
              <h2>Overall Statistics</h2>
              <div className="stats-grid">
                <HabitStatsCard 
                  icon="📋"
                  label="Total Habits"
                  value={totalHabits}
                  color="primary"
                />
                <HabitStatsCard 
                  icon="📈"
                  label="Average Completion"
                  value={`${averageCompletion}%`}
                  color="secondary"
                />
                <HabitStatsCard 
                  icon="🔥"
                  label="Current Streak"
                  value={`${maxCurrentStreak} days`}
                  color="success"
                />
                <HabitStatsCard 
                  icon="🏆"
                  label="Longest Streak"
                  value={`${maxLongestStreak} days`}
                  color="warning"
                />
                <HabitStatsCard 
                  icon="✓"
                  label="Total Check-ins"
                  value={totalCheckIns.toLocaleString()}
                  color="primary"
                />
                <HabitStatsCard 
                  icon="⏱️"
                  label="Total Focus Time"
                  value={formatFocusTime(totalFocusTime)}
                  color="secondary"
                />
              </div>
            </div>

            <div className="consistency-section">
              <h2>Consistency Heatmap</h2>
              <ConsistencyGrid 
                habits={filteredHabits}
                filterCategory={selectedCategory}
              />
            </div>

            {bestHabitData && bestHabitData.rate > 0 && (
              <div className="best-habit-section">
                <h2>🏆 Best Habit</h2>
                <div className="best-habit-card">
                  <div className="best-habit-content">
                    <h3>{bestHabitData.habit.name}</h3>
                    <p className="best-habit-category">{bestHabitData.habit.category}</p>
                  </div>
                  <div className="best-habit-stats">
                    <div className="completion-percentage">
                      {bestHabitData.rate}%
                    </div>
                    <p className="completion-label">30-day completion</p>
                  </div>
                </div>
              </div>
            )}

            {trendingHabits.length > 0 && (
              <div className="trending-section">
                <h2>🔥 Trending Habits</h2>
                <div className="habits-list">
                  {trendingHabits.map((habit, idx) => {
                    const stats = getHabitStats(habit);
                    return (
                      <div key={habit.id} className="trend-item">
                        <div className="trend-rank">#{idx + 1}</div>
                        <div className="trend-info">
                          <h4>{habit.name}</h4>
                          <p className="trend-category">{stats.category}</p>
                        </div>
                        <div className="trend-metrics">
                          <span className="momentum-score">
                            Momentum: {stats.momentum}
                          </span>
                          <span className="completion">
                            {stats.completionRate30}% (30d)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {struggleHabits.length > 0 && (
              <div className="struggle-section">
                <h2>⚠️ Habits Needing Attention</h2>
                <div className="habits-list">
                  {struggleHabits.map((habit, idx) => {
                    const stats = getHabitStats(habit);
                    return (
                      <div key={habit.id} className="struggle-item">
                        <div className="struggle-rank">#{idx + 1}</div>
                        <div className="struggle-info">
                          <h4>{habit.name}</h4>
                          <p className="struggle-category">{stats.category}</p>
                        </div>
                        <div className="struggle-metrics">
                          <span className="momentum-score">
                            Momentum: {stats.momentum}
                          </span>
                          <span className="completion">
                            {stats.completionRate30}% (30d)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="habit-details-section">
              <h2>Detailed Habit Analytics</h2>
              <div className="habit-details-grid">
                {filteredHabits.map(habit => {
                  const stats = getHabitStats(habit);
                  return (
                    <div key={habit.id} className="habit-detail-card">
                      <h3>{habit.name}</h3>
                      <div className="detail-stats">
                        <div className="detail-stat">
                          <span className="label">Current Streak</span>
                          <span className="value">{stats.currentStreak} days</span>
                        </div>
                        <div className="detail-stat">
                          <span className="label">Longest Streak</span>
                          <span className="value">{stats.longestStreak} days</span>
                        </div>
                        <div className="detail-stat">
                          <span className="label">7-Day Rate</span>
                          <span className="value">{stats.completionRate7}%</span>
                        </div>
                        <div className="detail-stat">
                          <span className="label">30-Day Rate</span>
                          <span className="value">{stats.completionRate30}%</span>
                        </div>
                        <div className="detail-stat">
                          <span className="label">Momentum</span>
                          <span className="value momentum">{stats.momentum}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
