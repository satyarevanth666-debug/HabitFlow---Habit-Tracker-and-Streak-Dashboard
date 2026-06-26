import React, { useState, useContext, useEffect } from 'react';
import { HabitContext } from '../context/HabitContext';
import '../styles/components/PomodoroTimer.css';

export const PomodoroTimer = ({ habitId = null, habits = [] }) => {
  const { addPomodoroSession } = useContext(HabitContext);
  const [selectedHabitId, setSelectedHabitId] = useState(habitId || (habits.length > 0 ? habits[0].id : null));
  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Time's up!
      handleTimeComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimeComplete = () => {
    if (mode === 'work') {
      // Work session completed
      if (selectedHabitId) {
        addPomodoroSession(selectedHabitId, 25);
      }
      setSessionsCompleted(prev => prev + 1);
      
      // Switch to break
      setMode('break');
      setTimeLeft(BREAK_TIME);
      setIsRunning(true);
    } else {
      // Break completed, switch back to work
      setMode('work');
      setTimeLeft(WORK_TIME);
      setIsRunning(false);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = mode === 'work' 
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-header">
        <h2>Pomodoro Timer</h2>
        <div className="pomodoro-badge">{mode === 'work' ? '🍅 Work' : '☕ Break'}</div>
      </div>

      <div className="pomodoro-display">
        <div className={`pomodoro-circle ${mode}`}>
          <svg className="progress-ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="time-display">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div className="pomodoro-stats">
        <div className="stat">
          <span className="stat-label">Sessions</span>
          <span className="stat-value">{sessionsCompleted}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Focus Time</span>
          <span className="stat-value">{sessionsCompleted * 25}m</span>
        </div>
      </div>

      {habits.length > 0 && (
        <div className="pomodoro-select">
          <label htmlFor="habit-select">Track Time For:</label>
          <select 
            id="habit-select"
            value={selectedHabitId || ''}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="habit-select"
          >
            <option value="">Select a habit...</option>
            {habits.map(habit => (
              <option key={habit.id} value={habit.id}>{habit.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="pomodoro-controls">
        {!isRunning ? (
          <button className="control-btn play-btn" onClick={handleStart}>
            ▶ Start
          </button>
        ) : (
          <button className="control-btn pause-btn" onClick={handlePause}>
            ⏸ Pause
          </button>
        )}
        <button className="control-btn reset-btn" onClick={handleReset}>
          ↻ Reset
        </button>
      </div>
    </div>
  );
};
