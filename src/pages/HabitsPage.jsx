import React, { useContext, useState } from 'react';
import { HabitContext } from '../context/HabitContext';
import { AddHabitForm } from '../components/AddHabitForm';
import { HabitList } from '../components/HabitList';
import { Modal } from '../components/Modal';
import { calculateCurrentStreak } from '../utils/streakUtils';
import { rankHabitsByMomentum } from '../utils/momentumUtils';
import '../styles/pages/HabitsPage.css';

export const HabitsPage = () => {
  const { habits, deleteHabit, getHabitsByCategory, notificationsSupported, notificationPermission, requestNotificationPermission } = useContext(HabitContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const CATEGORIES = ['All', 'Health', 'Fitness', 'Productivity', 'Learning', 'Finance', 'Reading', 'Custom'];

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : getHabitsByCategory(selectedCategory);

  const [selectedSort, setSelectedSort] = useState('Newest');
  const PRIORITY_ORDER = { Critical: 4, High: 3, Normal: 2, Low: 1 };

  const sortedHabits = React.useMemo(() => {
    const habitsToSort = [...filteredHabits];

    if (selectedSort === 'Priority') {
      return habitsToSort.sort((a, b) => (PRIORITY_ORDER[b.priority] || 2) - (PRIORITY_ORDER[a.priority] || 2));
    }

    if (selectedSort === 'Streak') {
      return habitsToSort.sort((a, b) => calculateCurrentStreak(b.checkIns) - calculateCurrentStreak(a.checkIns));
    }

    if (selectedSort === 'Momentum') {
      return rankHabitsByMomentum(habitsToSort);
    }

    return habitsToSort.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [filteredHabits, selectedSort]);

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

  return (
    <div className="habits-page">
      <div className="habits-container">
        <div className="habits-header">
          <div>
            <h1>Manage Your Habits</h1>
            <p>View, edit, and manage all your habits in one place</p>
          </div>
          <button 
            className="add-habit-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Cancel' : '+ Create Habit'}
          </button>
        </div>
        <div className="reminder-banner">
          <div>
            <strong>Reminder support:</strong> create habits with scheduled alerts for better consistency.
          </div>
          {notificationsSupported ? (
            <button className="reminder-btn" onClick={requestNotificationPermission}>
              {notificationPermission === 'granted' ? 'Permission granted' : 'Enable browser reminders'}
            </button>
          ) : (
            <div className="reminder-warning">Browser notifications are not supported.</div>
          )}
        </div>

        {showAddForm && (
          <div className="form-section">
            <h2>Create New Habit</h2>
            <AddHabitForm onSubmit={() => setShowAddForm(false)} />
          </div>
        )}

        <div className="filter-section">
          <div className="filter-head">
            <div>
              <h3>Filter by Category</h3>
              <p>Organize habits with category and momentum sorting.</p>
            </div>
            <div className="sort-section">
              <label htmlFor="sort-select">Sort by</label>
              <select
                id="sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="sort-select"
              >
                <option value="Newest">Newest</option>
                <option value="Priority">Priority</option>
                <option value="Streak">Streak</option>
                <option value="Momentum">Momentum</option>
              </select>
            </div>
          </div>

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

        <div className="habits-count">
          <span>{filteredHabits.length} {filteredHabits.length === 1 ? 'habit' : 'habits'}</span>
        </div>

        <HabitList
          habits={sortedHabits}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          emptyMessage={selectedCategory === 'All' 
            ? 'No habits yet. Create one to get started!' 
            : `No habits in ${selectedCategory} category.`
          }
        />
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
