// Streak calculation utilities

import { getTodayDate, getPreviousDate, getDaysDifference } from './dateUtils';

export const calculateCurrentStreak = (checkIns = {}) => {
  const today = getTodayDate();
  let currentDate = today;
  let streak = 0;

  // Allow streak to be calculated even if today is not checked
  while (checkIns[currentDate]) {
    streak++;
    currentDate = getPreviousDate(currentDate, 1);
  }

  return streak;
};

export const calculateLongestStreak = (checkIns = {}) => {
  const dates = Object.keys(checkIns).filter(date => checkIns[date]).sort();
  
  if (dates.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i] + 'T00:00:00');
    const previousDate = new Date(dates[i - 1] + 'T00:00:00');
    const dayDiff = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else if (dayDiff > 1) {
      currentStreak = 1;
    }
  }

  return longestStreak;
};

export const getStreakStatus = (streak) => {
  if (streak === 0) return 'Every expert was once a beginner.';
  if (streak <= 3) return 'Every expert was once a beginner.';
  if (streak <= 7) return 'Momentum is building.';
  if (streak <= 15) return "You're on fire.";
  if (streak <= 30) return 'Unstoppable.';
  return 'Legendary consistency.';
};

export const getStreakEmoji = (streak) => {
  if (streak === 0) return '🌱';
  if (streak <= 3) return '🌱';
  if (streak <= 7) return '📈';
  if (streak <= 15) return '🔥';
  if (streak <= 30) return '⚡';
  return '👑';
};

export const calculateCompletionRate = (checkIns = {}, days = 30) => {
  if (days === 0) return 0;

  const today = getTodayDate();
  let completedDays = 0;

  for (let i = 0; i < days; i++) {
    const date = getPreviousDate(today, i);
    if (checkIns[date]) {
      completedDays++;
    }
  }

  return Math.round((completedDays / days) * 100);
};

export const getCompletionHistory = (checkIns = {}, days = 30) => {
  const today = getTodayDate();
  const history = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = getPreviousDate(today, i);
    history.push({
      date,
      completed: checkIns[date] || false
    });
  }

  return history;
};

export const getConsistencyLevel = (completionRate) => {
  if (completionRate === 0) return 0;
  if (completionRate < 25) return 1;
  if (completionRate < 50) return 2;
  if (completionRate < 75) return 3;
  return 4;
};

export const canUseFreezToken = (freezeTokenData) => {
  if (!freezeTokenData) return true;
  if (freezeTokenData.available <= 0) return false;

  const today = getTodayDate();
  return freezeTokenData.lastUsed < today;
};

export const calculateHabitMomentum = (habit) => {
  // Recent activity (last 7 days) = 60%
  const last7DaysRate = calculateCompletionRate(habit.checkIns, 7);
  const recentScore = (last7DaysRate / 100) * 60;

  // Historical activity (lifetime) = 40%
  const totalDays = Math.max(Object.keys(habit.checkIns).filter(d => habit.checkIns[d]).length, 1);
  const lifetime = Object.keys(habit.checkIns).length || 1;
  const historicalRate = (totalDays / lifetime) * 100;
  const historicalScore = (historicalRate / 100) * 40;

  const momentum = Math.round(recentScore + historicalScore);
  return Math.min(momentum, 100);
};

export const getMomentumColor = (momentum) => {
  if (momentum < 25) return '#ef4444'; // Red
  if (momentum < 50) return '#f59e0b'; // Amber
  if (momentum < 75) return '#eab308'; // Yellow
  return '#22c55e'; // Green
};

export const getStreakMilestone = (streak) => {
  const milestones = [1, 3, 7, 14, 21, 30, 50, 100, 365];
  return milestones.find(m => m === streak) || null;
};

export const calculateTotalCheckIns = (habits) => {
  return habits.reduce((total, habit) => {
    return total + Object.keys(habit.checkIns).filter(date => habit.checkIns[date]).length;
  }, 0);
};

export const findBestHabit = (habits) => {
  if (habits.length === 0) return null;

  let bestHabit = habits[0];
  let bestRate = calculateCompletionRate(bestHabit.checkIns, 30);

  for (let i = 1; i < habits.length; i++) {
    const rate = calculateCompletionRate(habits[i].checkIns, 30);
    if (rate > bestRate) {
      bestRate = rate;
      bestHabit = habits[i];
    }
  }

  return { habit: bestHabit, rate: bestRate };
};
