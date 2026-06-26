// Momentum and analytics calculation utilities

import { calculateCompletionRate, calculateCurrentStreak, calculateLongestStreak } from './streakUtils';
import { getTodayDate, getPreviousDate } from './dateUtils';

export const calculateHabitMomentumScore = (habit) => {
  // Recent activity (last 7 days) = 60%
  const last7DaysRate = calculateCompletionRate(habit.checkIns, 7);
  const recentScore = (last7DaysRate / 100) * 60;

  // Historical activity (lifetime) = 40%
  const completedCount = Object.keys(habit.checkIns).filter(d => habit.checkIns[d]).length;
  const totalDaysTracked = Object.keys(habit.checkIns).length || 1;
  const historicalRate = (completedCount / totalDaysTracked) * 100;
  const historicalScore = (historicalRate / 100) * 40;

  return Math.round(recentScore + historicalScore);
};

export const getMomentumGradientColor = (score) => {
  // Returns CSS color based on momentum score
  if (score < 20) return '#ef4444'; // Red
  if (score < 40) return '#f97316'; // Orange
  if (score < 60) return '#f59e0b'; // Amber
  if (score < 80) return '#eab308'; // Yellow
  if (score < 90) return '#84cc16'; // Lime
  return '#22c55e'; // Green
};

export const getAverageCompletion = (habits) => {
  if (habits.length === 0) return 0;

  const total = habits.reduce((sum, habit) => {
    return sum + calculateCompletionRate(habit.checkIns, 30);
  }, 0);

  return Math.round(total / habits.length);
};

export const getHabitStats = (habit) => {
  const today = getTodayDate();
  const currentStreak = calculateCurrentStreak(habit.checkIns);
  const longestStreak = calculateLongestStreak(habit.checkIns);
  const completionRate7 = calculateCompletionRate(habit.checkIns, 7);
  const completionRate30 = calculateCompletionRate(habit.checkIns, 30);
  const completionRateTotal = calculateCompletionRate(habit.checkIns, Object.keys(habit.checkIns).length);

  return {
    name: habit.name,
    category: habit.category,
    currentStreak,
    longestStreak,
    completionRate7,
    completionRate30,
    completionRateTotal,
    totalCheckIns: Object.keys(habit.checkIns).filter(d => habit.checkIns[d]).length,
    daysSinceCreated: calculateDaysSinceCreation(habit.createdAt),
    focusTime: habit.timeSpent || 0,
    isCompletedToday: !!habit.checkIns[today],
    momentum: calculateHabitMomentumScore(habit)
  };
};

export const calculateDaysSinceCreation = (createdAt) => {
  const today = getTodayDate();
  const createdDate = new Date(createdAt + 'T00:00:00');
  const todayDate = new Date(today + 'T00:00:00');
  const diffTime = Math.abs(todayDate - createdDate);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const rankHabitsByMomentum = (habits) => {
  return [...habits].sort((a, b) => {
    const scoreA = calculateHabitMomentumScore(a);
    const scoreB = calculateHabitMomentumScore(b);
    return scoreB - scoreA;
  });
};

export const rankHabitsByStreak = (habits) => {
  return [...habits].sort((a, b) => {
    const streakA = calculateCurrentStreak(a.checkIns);
    const streakB = calculateCurrentStreak(b.checkIns);
    return streakB - streakA;
  });
};

export const rankHabitsByCompletion = (habits, days = 30) => {
  return [...habits].sort((a, b) => {
    const rateA = calculateCompletionRate(a.checkIns, days);
    const rateB = calculateCompletionRate(b.checkIns, days);
    return rateB - rateA;
  });
};

export const getTrendingHabits = (habits) => {
  return rankHabitsByMomentum(habits).slice(0, 5);
};

export const getStruggleHabits = (habits) => {
  return [...habits]
    .map(habit => ({
      habit,
      score: calculateHabitMomentumScore(habit)
    }))
    .filter(item => item.score < 50)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(item => item.habit);
};

export const calculateTotalFocusTime = (habits) => {
  return habits.reduce((total, habit) => total + (habit.timeSpent || 0), 0);
};

export const formatFocusTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const getProductivityTrend = (habits, days = 7) => {
  const today = getTodayDate();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = getPreviousDate(today, i);
    let completedCount = 0;

    habits.forEach(habit => {
      if (habit.checkIns[date]) {
        completedCount++;
      }
    });

    data.push({
      date,
      completed: completedCount,
      percentage: Math.round((completedCount / habits.length) * 100)
    });
  }

  return data;
};

export const getWeeklyStats = (habits) => {
  const today = getTodayDate();
  const stats = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 7; i++) {
    const date = getPreviousDate(today, i);
    const dayIndex = new Date(date + 'T00:00:00').getDay();
    const dayName = dayNames[dayIndex];

    habits.forEach(habit => {
      if (habit.checkIns[date]) {
        stats[dayName]++;
      }
    });
  }

  return stats;
};
