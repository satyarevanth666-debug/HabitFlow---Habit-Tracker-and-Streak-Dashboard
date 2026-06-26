import React, { useMemo, useState } from 'react';
import {
  getTodayDate,
  getMonthName,
  getYear,
  getDateString,
} from '../utils/dateUtils';
import '../styles/components/CalendarView.css';

const getCellColor = (completed, total) => {
  if (total === 0) return 'calendar-empty';
  const percentage = Math.round((completed / total) * 100);
  if (percentage === 0) return 'calendar-none';
  if (percentage < 25) return 'calendar-low';
  if (percentage < 50) return 'calendar-medium';
  if (percentage < 75) return 'calendar-high';
  return 'calendar-very-high';
};

export const CalendarView = ({ habits }) => {
  const today = getTodayDate();
  const [hoveredDate, setHoveredDate] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const todayDate = useMemo(() => new Date(today + 'T00:00:00'), [today]);
  const currentDate = useMemo(() => {
    const date = new Date(todayDate);
    date.setMonth(date.getMonth() + monthOffset);
    return date;
  }, [todayDate, monthOffset]);
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDate = new Date(year, month, 1);
  const firstDayIndex = firstDate.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalHabits = habits.length;

  const days = useMemo(() => {
    const dayList = [];
    for (let i = 0; i < firstDayIndex; i++) {
      dayList.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = new Date(year, month, day).toISOString().split('T')[0];
      dayList.push(dateString);
    }
    return dayList;
  }, [firstDayIndex, daysInMonth, month, year]);

  const getCompletionForDate = (dateString) => {
    const completed = habits.reduce((count, habit) => {
      if (habit.checkIns[dateString]) {
        return count + 1;
      }
      return count;
    }, 0);
    return completed;
  };

  const completedDays = useMemo(() => {
    return days.filter((dateString) => dateString && getCompletionForDate(dateString) > 0).length;
  }, [days]);

  const calendarScore = useMemo(() => {
    if (totalHabits === 0) return 0;
    return Math.round((completedDays / daysInMonth) * 100);
  }, [completedDays, daysInMonth, totalHabits]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabel = getMonthName(currentDate.toISOString().split('T')[0]);
  const canGoNext = monthOffset < 0;

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <div>
          <h2>Monthly Calendar</h2>
          <p>Track habit completion for {monthLabel} {year}</p>
        </div>
        <div className="calendar-nav">
          <button
            className="calendar-nav-btn"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            type="button"
          >
            ←
          </button>
          <span className="calendar-nav-label">{monthLabel} {year}</span>
          <button
            className="calendar-nav-btn"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            disabled={!canGoNext}
            type="button"
          >
            →
          </button>
          <button
            className="calendar-today-btn"
            onClick={() => setMonthOffset(0)}
            disabled={monthOffset === 0}
            type="button"
          >
            Today
          </button>
        </div>
        <div className="calendar-summary">
          <div className="calendar-badge">{completedDays} / {daysInMonth} active</div>
          <span>{calendarScore}%</span>
          <p>Active days this month</p>
        </div>
      </div>

      <div className="calendar-grid-wrapper">
        <div className="calendar-day-labels">
          {dayLabels.map((label) => (
            <div key={label} className="calendar-day-label">
              {label}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((dateString, index) => {
            const completed = dateString ? getCompletionForDate(dateString) : 0;
            const cellClass = dateString ? getCellColor(completed, totalHabits) : 'calendar-empty';
            const isToday = dateString === today;
            const label = dateString ? new Date(dateString + 'T00:00:00').getDate() : '';

            return (
              <div
                key={`${dateString || 'empty'}-${index}`}
                className={`calendar-cell ${cellClass} ${isToday ? 'today' : ''}`}
                onMouseEnter={() => setHoveredDate(dateString)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <span className="calendar-cell-day">{label}</span>
                {hoveredDate === dateString && dateString && (
                  <div className="calendar-tooltip">
                    <div>{getDateString(dateString)}</div>
                    <div>{completed} / {totalHabits} habits</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
