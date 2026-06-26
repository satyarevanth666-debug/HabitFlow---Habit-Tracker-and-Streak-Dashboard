import React, { useContext } from 'react';
import { HabitContext } from '../context/HabitContext';
import { getTodayDate, getPreviousDate } from '../utils/dateUtils';
import { calculateCurrentStreak } from '../utils/streakUtils';
import '../styles/components/FreezeToken.css';

export const FreezeToken = ({ habitId }) => {
  const { habits, freezeTokens, useFreezeToken } = useContext(HabitContext);
  const habit = habits.find(h => h.id === habitId);

  if (!habit) return null;

  const today = getTodayDate();
  const yesterday = getPreviousDate(today, 1);
  const currentStreak = calculateCurrentStreak(habit.checkIns);
  
  // Check if user missed yesterday
  const missedYesterday = !habit.checkIns[yesterday];
  const canUseToken = freezeTokens.available > 0 && missedYesterday;

  const handleUseToken = () => {
    useFreezeToken(habitId);
  };

  return (
    <div className={`freeze-token-container ${canUseToken ? 'active' : 'inactive'}`}>
      <div className="token-header">
        <span className="token-icon">❄️</span>
        <span className="token-label">Freeze Token</span>
      </div>

      <div className="token-info">
        <p className="token-status">
          {freezeTokens.available > 0 ? (
            <>
              <span className="available">Available: {freezeTokens.available}</span>
              <span className="reset-note">Resets weekly</span>
            </>
          ) : (
            <span className="unavailable">No tokens available</span>
          )}
        </p>
      </div>

      {missedYesterday && (
        <div className="warning-message">
          ⚠️ You missed yesterday! Use a freeze token to protect your {currentStreak}-day streak.
        </div>
      )}

      <button 
        className={`use-token-btn ${!canUseToken ? 'disabled' : ''}`}
        onClick={handleUseToken}
        disabled={!canUseToken}
        title={!canUseToken ? 'No tokens available or no missed day' : 'Use freeze token'}
      >
        {canUseToken ? '❄️ Use Freeze Token' : 'No Tokens'}
      </button>

      <p className="token-description">
        One freeze token per week. Protects your streak if you miss a day.
      </p>
    </div>
  );
};
