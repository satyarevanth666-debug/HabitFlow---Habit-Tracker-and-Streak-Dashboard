import React, { useState, useMemo } from 'react';
import { getTodayDate, getFormattedDate, getMonthName, getLast30Days } from '../utils/dateUtils';
import { getConsistencyLevel } from '../utils/streakUtils';
import '../styles/components/ConsistencyGrid.css';

export const ConsistencyGrid = ({ habits, filterCategory = 'All' }) => {
  const [hoveredDate, setHoveredDate] = useState(null);
  const last30Days = useMemo(() => getLast30Days(), []);

  const getCompletionForDate = (date) => {
    let completed = 0;
    habits.forEach(habit => {
      if (filterCategory === 'All' || habit.category === filterCategory) {
        if (habit.checkIns[date]) {
          completed++;
        }
      }
    });
    return completed;
  };

  const getTotalHabitsForDate = (date) => {
    if (filterCategory === 'All') {
      return habits.length;
    }
    return habits.filter(h => h.category === filterCategory).length;
  };

  const getConsistencyInfo = (date) => {
    const completed = getCompletionForDate(date);
    const total = getTotalHabitsForDate(date);
    return { completed, total };
  };

  const getCellColor = (date) => {
    const { completed, total } = getConsistencyInfo(date);
    if (total === 0) return 'empty';

    const percentage = (completed / total) * 100;
    if (percentage === 0) return 'none';
    if (percentage < 25) return 'low';
    if (percentage < 50) return 'medium';
    if (percentage < 75) return 'high';
    return 'very-high';
  };

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < last30Days.length; i += 7) {
    weeks.push(last30Days.slice(i, i + 7));
  }

  return (
    <div className="consistency-grid-container">
      <div className="grid-header">
        <h3>Consistency Heatmap - Last 30 Days</h3>
        <div className="grid-legend">
          <div className="legend-item">
            <div className="legend-cell none"></div>
            <span>No data</span>
          </div>
          <div className="legend-item">
            <div className="legend-cell low"></div>
            <span>Low</span>
          </div>
          <div className="legend-item">
            <div className="legend-cell medium"></div>
            <span>Medium</span>
          </div>
          <div className="legend-item">
            <div className="legend-cell high"></div>
            <span>High</span>
          </div>
          <div className="legend-item">
            <div className="legend-cell very-high"></div>
            <span>Very High</span>
          </div>
        </div>
      </div>

      <div className="grid-wrapper">
        <div className="day-labels">
          <div className="day-label">Sun</div>
          <div className="day-label">Mon</div>
          <div className="day-label">Tue</div>
          <div className="day-label">Wed</div>
          <div className="day-label">Thu</div>
          <div className="day-label">Fri</div>
          <div className="day-label">Sat</div>
        </div>

        <div className="consistency-grid">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid-week">
              {week.map((date, dayIndex) => {
                const cellColor = getCellColor(date);
                const { completed, total } = getConsistencyInfo(date);
                const isHovered = hoveredDate === date;
                const isToday = date === getTodayDate();

                return (
                  <div
                    key={date}
                    className={`grid-cell ${cellColor} ${isToday ? 'today' : ''} ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    title={`${getFormattedDate(date)}`}
                  >
                    {isHovered && (
                      <div className="grid-tooltip">
                        <div className="tooltip-date">{getFormattedDate(date)}</div>
                        <div className="tooltip-info">{completed} of {total} completed</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
