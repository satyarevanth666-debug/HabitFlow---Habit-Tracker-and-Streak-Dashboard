// LocalStorage utility functions

const STORAGE_KEYS = {
  HABITS: 'habits_tracker_habits',
  SETTINGS: 'habits_tracker_settings',
  FREEZE_TOKENS: 'habits_tracker_freeze_tokens',
  POMODORO: 'habits_tracker_pomodoro'
};

export const saveHabits = (habits) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    return true;
  } catch (error) {
    console.error('Error saving habits:', error);
    return false;
  }
};

export const loadHabits = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const loadSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'dark', notifications: true };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { theme: 'dark', notifications: true };
  }
};

export const saveFreezeTokens = (freezeTokens) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FREEZE_TOKENS, JSON.stringify(freezeTokens));
    return true;
  } catch (error) {
    console.error('Error saving freeze tokens:', error);
    return false;
  }
};

export const loadFreezeTokens = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FREEZE_TOKENS);
    return data ? JSON.parse(data) : { available: 1, lastUsed: null, expiresAt: null };
  } catch (error) {
    console.error('Error loading freeze tokens:', error);
    return { available: 1, lastUsed: null, expiresAt: null };
  }
};

export const savePomodoroData = (pomodoroData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.POMODORO, JSON.stringify(pomodoroData));
    return true;
  } catch (error) {
    console.error('Error saving pomodoro data:', error);
    return false;
  }
};

export const loadPomodoroData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.POMODORO);
    return data ? JSON.parse(data) : { sessionsCompleted: 0, totalFocusTime: 0 };
  } catch (error) {
    console.error('Error loading pomodoro data:', error);
    return { sessionsCompleted: 0, totalFocusTime: 0 };
  }
};

export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const exportData = () => {
  try {
    const data = {
      habits: loadHabits(),
      settings: loadSettings(),
      freezeTokens: loadFreezeTokens(),
      pomodoro: loadPomodoroData(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export const importData = (dataString) => {
  try {
    const data = JSON.parse(dataString);
    if (data.habits) saveHabits(data.habits);
    if (data.settings) saveSettings(data.settings);
    if (data.freezeTokens) saveFreezeTokens(data.freezeTokens);
    if (data.pomodoro) savePomodoroData(data.pomodoro);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const getStorageSize = () => {
  let total = 0;
  Object.values(STORAGE_KEYS).forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      total += item.length + key.length;
    }
  });
  return (total / 1024).toFixed(2) + ' KB';
};
