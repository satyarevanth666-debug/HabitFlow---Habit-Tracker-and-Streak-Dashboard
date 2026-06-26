import React, { useContext, useEffect } from 'react';
import { HabitContext } from '../context/HabitContext';
import '../styles/components/Toast.css';

export const Toast = () => {
  const { toast } = useContext(HabitContext);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-content">
        {toast.type === 'success' && <span className="toast-icon">✓</span>}
        {toast.type === 'error' && <span className="toast-icon">✕</span>}
        {toast.type === 'info' && <span className="toast-icon">ℹ</span>}
        <span className="toast-message">{toast.message}</span>
      </div>
    </div>
  );
};
