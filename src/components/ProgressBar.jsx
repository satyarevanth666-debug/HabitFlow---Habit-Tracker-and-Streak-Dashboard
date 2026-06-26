import React from 'react';
import '../styles/components/ProgressBar.css';

export const ProgressBar = ({ completed, total, animate = true }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-label">Today's Progress</span>
        <span className="progress-value">{completed} / {total} Completed</span>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${animate ? 'animate' : ''}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-percentage">{percentage}%</div>
    </div>
  );
};
