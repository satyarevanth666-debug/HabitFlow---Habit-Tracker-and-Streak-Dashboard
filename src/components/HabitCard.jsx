import React, { useContext, useState, useEffect } from 'react';
import { HabitContext } from '../context/HabitContext';
import { getTodayDate } from '../utils/dateUtils';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import '../styles/components/HabitCard.css';

export const HabitCard = ({ habit, onEdit, onDelete }) => {
  const { checkInHabit } = useContext(HabitContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const today = getTodayDate();
  const isCompletedToday = habit.checkIns[today];
  const currentStreak = calculateCurrentStreak(habit.checkIns);
  const longestStreak = calculateLongestStreak(habit.checkIns);

  const handleCheckIn = () => {
    setIsAnimating(true);
    checkInHabit(habit.id);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const focusTimeHours = Math.floor((habit.timeSpent || 0) / 60);
  const focusTimeMins = (habit.timeSpent || 0) % 60;
  const statusLabel = isCompletedToday ? 'Completed' : habit.frequency === 'Daily' ? 'Due Today' : habit.frequency;

  return (
    <div className={`habit-card ${isCompletedToday ? 'completed' : ''}`}>
      <div className="habit-card-header">
        <div className="habit-info">
          <div className="habit-icon" style={{ backgroundColor: habit.color }}>
            {habit.category === 'Health' && '🏥'}
            {habit.category === 'Fitness' && '💪'}
            {habit.category === 'Productivity' && '⚡'}
            {habit.category === 'Learning' && '📚'}
            {habit.category === 'Finance' && '💰'}
            {habit.category === 'Reading' && '📖'}
            {habit.category === 'Custom' && '⭐'}
          </div>
          <div className="habit-details">
            <div className="habit-labels">
              <h3 className="habit-name">{habit.name}</h3>
              <div className="habit-meta">
                <span className={`priority-pill priority-${habit.priority?.toLowerCase()}`}>{habit.priority || 'Normal'}</span>
                <span className={`status-pill ${isCompletedToday ? 'status-done' : 'status-due'}`}>{statusLabel}</span>
              </div>
            </div>
            <p className="habit-category">{habit.category} • {habit.frequency}</p>
            {habit.reminderEnabled && (
              <div className="habit-reminder">
                ⏰ Reminder at {habit.reminderTime}
              </div>
            )}
          </div>
        </div>
        <div className="habit-actions">
          <button className="action-btn edit-btn" onClick={onEdit} title="Edit habit">✏️</button>
          <button className="action-btn delete-btn" onClick={onDelete} title="Delete habit">🗑️</button>
        </div>
      </div>

      {habit.description && (
        <p className="habit-description">{habit.description}</p>
      )}

      <div className="habit-stats">
        <div className="stat">
          <span className="stat-label">Current Streak</span>
          <span className="stat-value">
            <span className="streak-emoji">🔥</span> {currentStreak} days
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Longest Streak</span>
          <span className="stat-value">
            <span className="streak-emoji">🏆</span> {longestStreak} days
          </span>
        </div>
        {(habit.timeSpent > 0) && (
          <div className="stat">
            <span className="stat-label">Focus Time</span>
            <span className="stat-value">⏱️ {focusTimeHours}h {focusTimeMins}m</span>
          </div>
        )}
      </div>

      <button 
        className={`checkin-btn ${isCompletedToday ? 'checked' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={handleCheckIn}
      >
        <span className="checkin-icon">{isCompletedToday ? '✓' : '○'}</span>
        <span className="checkin-text">
          {isCompletedToday ? 'Completed Today' : 'Mark Complete'}
        </span>
      </button>
    </div>
  );
};
