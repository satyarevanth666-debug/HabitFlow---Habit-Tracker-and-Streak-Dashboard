import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { HabitContext } from '../context/HabitContext';
import { ProgressBar } from '../components/ProgressBar';
import { HabitCard } from '../components/HabitCard';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { Modal } from '../components/Modal';
import { CalendarView } from '../components/CalendarView';
import { FreezeToken } from '../components/FreezeToken';
import { AddHabitForm } from '../components/AddHabitForm';
import { getTodayDate } from '../utils/dateUtils';
import { getStreakEmoji, getStreakStatus } from '../utils/streakUtils';
import '../styles/pages/DashboardPage.css';

export const DashboardPage = () => {
  const { habits, getOverallStats, deleteHabit, pomodoroData } = useContext(HabitContext);
  const stats = getOverallStats();
  const todayHabits = habits.filter(h => h.frequency === 'Daily');
  const today = getTodayDate();
  const completedToday = todayHabits.filter(h => h.checkIns[today]).length;
  const focusHours = Math.floor((pomodoroData.totalFocusTime || 0) / 60);
  const focusMinutes = (pomodoroData.totalFocusTime || 0) % 60;
  const focusDisplay = `${focusHours}h ${focusMinutes}m`;
  const focusEfficiency = todayHabits.length ? Math.min(100, Math.round((pomodoroData.sessionsCompleted * 100) / todayHabits.length)) : 0;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDeleteClick = (habitId) => {
    setHabitToDelete(habitId);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (habit) => {
    setEditHabit(habit);
    setShowEditModal(true);
  };

  const handleConfirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete);
      setDeleteModalOpen(false);
      setHabitToDelete(null);
    }
  };

  const maxStreak = Math.max(...todayHabits.map(h => {
    let current = 0;
    let d = today;
    while (h.checkIns[d]) {
      current++;
      const date = new Date(d);
      date.setDate(date.getDate() - 1);
      d = date.toISOString().split('T')[0];
    }
    return current;
  }), 0);

  const motivationalMessage = getStreakStatus(maxStreak);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="date-label">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {todayHabits.length === 0 ? (
          <div className="empty-dashboard">
            <div className="empty-icon">🌱</div>
            <h2>No habits yet!</h2>
            <p>Create your first habit to get started.</p>
            <Link to="/habits" className="create-habit-link">Create Habit →</Link>
          </div>
        ) : (
          <>
            <ProgressBar 
              completed={completedToday} 
              total={todayHabits.length}
              animate={true}
            />

            <div className="motivation-banner">
              <div className="motivation-content">
                <span className="motivation-emoji">{getStreakEmoji(maxStreak)}</span>
                <p className="motivation-message">{motivationalMessage}</p>
              </div>
            </div>

            <div className="dashboard-kpis">
              <div className="kpi-card kpi-card--glow">
                <span>Best Streak</span>
                <strong>{stats.longestStreak} days</strong>
              </div>
              <div className="kpi-card">
                <span>Focus Efficiency</span>
                <strong>{focusEfficiency}%</strong>
              </div>
              <div className="kpi-card">
                <span>Total Check-ins</span>
                <strong>{stats.totalCheckIns}</strong>
              </div>
              <div className="kpi-card">
                <span>Freeze Tokens</span>
                <strong>{stats.freezeTokensAvailable}</strong>
              </div>
            </div>

            <div className="dashboard-section dashboard-top-row">
              <div className="track-card track-card--progress">
                <h2>Today's Progress</h2>
                <p className="track-copy">Complete your daily habits and keep the streak alive.</p>
                <ProgressBar 
                  completed={completedToday} 
                  total={todayHabits.length}
                  animate={true}
                />
              </div>

              <div className="track-card track-card--focus">
                <div className="track-card-header">
                  <div>
                    <h3>Focus Summary</h3>
                    <p className="track-copy">Your Pomodoro productivity so far.</p>
                  </div>
                  <span className="focus-badge">{pomodoroData.sessionsCompleted} sessions</span>
                </div>
                <div className="focus-metrics">
                  <div>
                    <span className="metric-label">Focus Time</span>
                    <strong>{focusDisplay}</strong>
                  </div>
                  <div>
                    <span className="metric-label">Today's Habits</span>
                    <strong>{todayHabits.length}</strong>
                  </div>
                  <div>
                    <span className="metric-label">Completion</span>
                    <strong>{stats.completionRate}%</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>Today's Habits</h2>
                <button 
                  className="pomodoro-link"
                  onClick={() => setShowPomodoroModal(true)}
                  title="Open Pomodoro Timer"
                >
                  🍅 Pomodoro
                </button>
              </div>
              <div className="habits-grid">
                {todayHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onEdit={() => handleEditClick(habit)}
                    onDelete={() => handleDeleteClick(habit.id)}
                  />
                ))}
              </div>
            </div>

            <CalendarView habits={todayHabits} />

            <div className="dashboard-stats dashboard-stats--premium">
              <div className="stat-box stat-box--accent">
                <span className="stat-box-label">Longest Streak</span>
                <span className="stat-box-value">{stats.longestStreak} days</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-label">Total Check-ins</span>
                <span className="stat-box-value">{stats.totalCheckIns}</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-label">Tokens</span>
                <span className="stat-box-value">{stats.freezeTokensAvailable}</span>
              </div>
            </div>

            <div className="token-panel">
              <h2>Streak Protection</h2>
              <p>Stay ahead of missed days with a weekly freeze token.</p>
              {todayHabits.length > 0 ? (
                <FreezeToken habitId={todayHabits[0].id} />
              ) : (
                <div className="token-empty">
                  <p>No daily habits yet. Add one to unlock streak protection and tokens.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        title="Delete Habit?"
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      >
        <p>Are you sure you want to delete this habit? This action cannot be undone.</p>
      </Modal>

      <Modal
        isOpen={showPomodoroModal}
        title="Pomodoro Timer"
        onClose={() => setShowPomodoroModal(false)}
      >
        <PomodoroTimer habits={todayHabits} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        title="Edit Habit"
        onClose={() => setShowEditModal(false)}
      >
        {editHabit && (
          <AddHabitForm
            initialHabit={editHabit}
            isEditing={true}
            onSubmit={() => setShowEditModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};
