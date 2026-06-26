import React from 'react';
import { HabitCard } from './HabitCard';
import '../styles/components/HabitList.css';

export const HabitList = ({ habits, onEdit, onDelete, emptyMessage = 'No habits yet. Start by creating one!' }) => {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <p className="empty-message">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onEdit={() => onEdit(habit)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </div>
  );
};
