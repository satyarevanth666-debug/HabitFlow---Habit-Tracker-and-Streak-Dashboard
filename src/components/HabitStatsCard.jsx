import React from 'react';
import '../styles/components/HabitStatsCard.css';

export const HabitStatsCard = ({ icon, label, value, subValue = null, color = 'primary', trend = null }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <p className="stats-card-label">{label}</p>
        <p className="stats-card-value">{value}</p>
        {subValue && <p className="stats-card-sub">{subValue}</p>}
        {trend && (
          <div className={`stats-card-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};
