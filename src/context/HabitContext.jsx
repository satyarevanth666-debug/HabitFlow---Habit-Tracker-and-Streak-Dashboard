import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTodayDate, getWeekNumber } from '../utils/dateUtils';
import { calculateCurrentStreak, calculateLongestStreak, calculateCompletionRate } from '../utils/streakUtils';

export const HabitContext = createContext();

const INITIAL_HABIT_STATE = [];

const INITIAL_FREEZE_TOKEN_STATE = {
  available: 1,
  lastUsed: null,
  lastResetWeek: getWeekNumber(getTodayDate()),
  expiresAt: null
};

const INITIAL_SETTINGS_STATE = {
  theme: 'dark',
  notifications: true
};

const INITIAL_POMODORO_STATE = {
  sessionsCompleted: 0,
  totalFocusTime: 0
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useLocalStorage('habits_tracker_habits', INITIAL_HABIT_STATE);
  const [freezeTokens, setFreezeTokens] = useLocalStorage('habits_tracker_freeze_tokens', INITIAL_FREEZE_TOKEN_STATE);
  const [pomodoroData, setPomodoroData] = useLocalStorage('habits_tracker_pomodoro', INITIAL_POMODORO_STATE);
  const [settings, setSettings] = useLocalStorage('habits_tracker_settings', INITIAL_SETTINGS_STATE);
  const [toast, setToast] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const theme = settings?.theme || 'dark';

  // Toast notification helper
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    if (duration) {
      setTimeout(() => setToast(null), duration);
    }
  }, []);

  // Create a new habit
  const addHabit = useCallback((habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      category: habitData.category,
      frequency: habitData.frequency,
      priority: habitData.priority || 'Normal',
      reminderEnabled: habitData.reminderEnabled || false,
      reminderTime: habitData.reminderTime || '08:00',
      color: habitData.color,
      description: habitData.description,
      createdAt: getTodayDate(),
      timeSpent: 0,
      checkIns: {},
      lastReminderDate: null
    };

    setHabits([...habits, newHabit]);
    showToast(`Habit "${newHabit.name}" added successfully!`, 'success');
    return newHabit;
  }, [habits, setHabits, showToast]);

  // Update a habit
  const updateHabit = useCallback((id, updates) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    );
    setHabits(updatedHabits);
    showToast('Habit updated successfully!', 'success');
  }, [habits, setHabits, showToast]);

  // Delete a habit
  const deleteHabit = useCallback((id) => {
    const habit = habits.find(h => h.id === id);
    const filteredHabits = habits.filter(h => h.id !== id);
    setHabits(filteredHabits);
    showToast(`Habit "${habit?.name}" deleted.`, 'info');
  }, [habits, setHabits, showToast]);

  // Check in a habit (mark as complete for today)
  const checkInHabit = useCallback((id) => {
    const today = getTodayDate();
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        return {
          ...habit,
          checkIns: {
            ...habit.checkIns,
            [today]: !habit.checkIns[today]
          }
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
  }, [habits, setHabits]);

  // Mark habit complete on specific date
  const checkInHabitOnDate = useCallback((id, date, value) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        return {
          ...habit,
          checkIns: {
            ...habit.checkIns,
            [date]: value
          }
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
  }, [habits, setHabits]);

  // Get habit by ID
  const getHabit = useCallback((id) => {
    return habits.find(h => h.id === id);
  }, [habits]);

  // Get today's habits (due today)
  const getTodayHabits = useCallback(() => {
    return habits.filter(habit => habit.frequency === 'Daily');
  }, [habits]);

  // Add focus time to habit
  const addFocusTime = useCallback((habitId, minutes) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          timeSpent: (habit.timeSpent || 0) + minutes
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
  }, [habits, setHabits]);

  // Use freeze token to protect streak
  const useFreezeToken = useCallback((habitId) => {
    if (freezeTokens.available <= 0) {
      showToast('No freeze tokens available!', 'error');
      return false;
    }

    const today = getTodayDate();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Mark yesterday as complete if not already
    checkInHabitOnDate(habitId, yesterdayStr, true);

    // Update freeze tokens
    const updatedTokens = {
      ...freezeTokens,
      available: freezeTokens.available - 1,
      lastUsed: today,
      expiresAt: new Date(today).setDate(new Date(today).getDate() + 7).toString()
    };

    setFreezeTokens(updatedTokens);
    showToast('Freeze token used! Your streak is protected.', 'success');
    return true;
  }, [freezeTokens, setFreezeTokens, checkInHabitOnDate, showToast]);

  // Add pomodoro session
  const addPomodoroSession = useCallback((habitId, minutes) => {
    // Add focus time to habit
    addFocusTime(habitId, minutes);

    // Update pomodoro stats
    const updated = {
      sessionsCompleted: pomodoroData.sessionsCompleted + 1,
      totalFocusTime: pomodoroData.totalFocusTime + minutes
    };
    setPomodoroData(updated);
    showToast('Pomodoro session completed! Time added to habit.', 'success');
  }, [pomodoroData, setPomodoroData, addFocusTime, showToast]);

  useEffect(() => {
    const today = getTodayDate();
    const currentWeek = getWeekNumber(today);

    if (freezeTokens.lastResetWeek !== currentWeek) {
      setFreezeTokens(prev => ({
        ...prev,
        available: 1,
        lastResetWeek: currentWeek
      }));
    }
  }, [freezeTokens, setFreezeTokens]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supported = 'Notification' in window;
    setNotificationsSupported(supported);

    if (supported) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const requestNotificationPermission = useCallback(async () => {
    if (!notificationsSupported) {
      showToast('Browser notifications are not supported.', 'error');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        showToast('Reminder permission enabled. You will get habit reminders while the app is open.', 'success');
      } else if (permission === 'denied') {
        showToast('Notification permission denied. Reminders will still show as in-app alerts.', 'info');
      }
    } catch (error) {
      showToast('Unable to request notification permission.', 'error');
    }
  }, [notificationsSupported, showToast]);

  const toggleTheme = useCallback(() => {
    setSettings(prevSettings => {
      const nextTheme = prevSettings.theme === 'dark' ? 'light' : 'dark';
      showToast(`Switched to ${nextTheme} mode.`, 'success');
      return {
        ...prevSettings,
        theme: nextTheme
      };
    });
  }, [setSettings, showToast]);

  const sendReminderNotification = useCallback((habit) => {
    const title = `Habit Reminder: ${habit.name}`;
    const message = habit.description
      ? `Reminder to complete ${habit.name}. ${habit.description}`
      : `Reminder to complete ${habit.name}.`;

    if (notificationsSupported && notificationPermission === 'granted') {
      new Notification(title, {
        body: message,
        silent: false
      });
    } else {
      showToast(`Reminder: ${habit.name}`, 'info', 5000);
    }
  }, [notificationPermission, notificationsSupported, showToast]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = getTodayDate();
      let shouldUpdate = false;

      const updatedHabits = habits.map(habit => {
        if (!habit.reminderEnabled || habit.reminderTime !== currentTime) {
          return habit;
        }

        if (habit.lastReminderDate === today) {
          return habit;
        }

        sendReminderNotification(habit);
        shouldUpdate = true;
        return {
          ...habit,
          lastReminderDate: today
        };
      });

      if (shouldUpdate) {
        setHabits(updatedHabits);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [habits, sendReminderNotification, setHabits]);

  // Get overall stats
  const getOverallStats = useCallback(() => {
    const today = getTodayDate();
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.checkIns[today]).length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;

    habits.forEach(habit => {
      const currentStreak = calculateCurrentStreak(habit.checkIns);
      const longestStreak = calculateLongestStreak(habit.checkIns);

      if (currentStreak > maxCurrentStreak) maxCurrentStreak = currentStreak;
      if (longestStreak > maxLongestStreak) maxLongestStreak = longestStreak;
    });

    const totalCheckIns = habits.reduce((sum, habit) => {
      return sum + Object.keys(habit.checkIns).filter(d => habit.checkIns[d]).length;
    }, 0);

    return {
      totalHabits,
      completedToday,
      completionRate,
      currentStreak: maxCurrentStreak,
      longestStreak: maxLongestStreak,
      totalCheckIns,
      freezeTokensAvailable: freezeTokens.available
    };
  }, [habits, freezeTokens]);

  // Get habits by category
  const getHabitsByCategory = useCallback((category) => {
    return habits.filter(h => h.category === category);
  }, [habits]);

  // Reset daily data (for demo purposes)
  const resetAllData = useCallback(() => {
    setHabits(INITIAL_HABIT_STATE);
    setFreezeTokens(INITIAL_FREEZE_TOKEN_STATE);
    setPomodoroData(INITIAL_POMODORO_STATE);
    showToast('All data reset successfully.', 'info');
  }, [setHabits, setFreezeTokens, setPomodoroData, showToast]);

  const value = {
    // State
    habits,
    freezeTokens,
    pomodoroData,
    toast,
    notificationPermission,
    notificationsSupported,

    // Habit management
    addHabit,
    updateHabit,
    deleteHabit,
    getHabit,
    getTodayHabits,
    requestNotificationPermission,

    // Check-ins
    checkInHabit,
    checkInHabitOnDate,

    // Focus time & Pomodoro
    addFocusTime,
    addPomodoroSession,

    // Freeze tokens
    useFreezeToken,

    // Stats & Analytics
    getOverallStats,
    getHabitsByCategory,

    // Utilities
    showToast,
    resetAllData,
    settings,
    theme,
    toggleTheme
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
