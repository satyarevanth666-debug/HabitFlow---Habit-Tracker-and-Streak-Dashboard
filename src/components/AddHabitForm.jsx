import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HabitContext } from '../context/HabitContext';
import '../styles/components/AddHabitForm.css';

export const AddHabitForm = ({ initialHabit = null, onSubmit = null, isEditing = false }) => {
  const navigate = useNavigate();
  const { addHabit, updateHabit } = useContext(HabitContext);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialHabit || {
    name: '',
    category: 'Health',
    frequency: 'Daily',
    priority: 'Normal',
    reminderEnabled: false,
    reminderTime: '08:00',
    color: '#8b5cf6',
    description: ''
  });

  const CATEGORIES = ['Health', 'Fitness', 'Productivity', 'Learning', 'Finance', 'Reading', 'Custom'];
  const FREQUENCIES = ['Daily', 'Weekly', 'Custom'];
  const PRIORITIES = ['Low', 'Normal', 'High', 'Critical'];
  const COLORS = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Habit name must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (formData.reminderEnabled && !formData.reminderTime) {
      newErrors.reminderTime = 'Reminder time is required when reminders are enabled';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'name') {
      if (!value.trim()) {
        newErrors.name = 'Habit name is required';
      } else if (value.trim().length < 3) {
        newErrors.name = 'Habit name must be at least 3 characters';
      } else {
        delete newErrors.name;
      }
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    if (initialHabit) {
      setFormData(initialHabit);
    }
  }, [initialHabit]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const habitPayload = {
        name: formData.name,
        category: formData.category,
        frequency: formData.frequency,
        priority: formData.priority,
        reminderEnabled: formData.reminderEnabled,
        reminderTime: formData.reminderTime,
        color: formData.color,
        description: formData.description
      };

      if (isEditing && initialHabit) {
        updateHabit(initialHabit.id, habitPayload);
        if (onSubmit) {
          onSubmit();
        } else {
          navigate('/habits');
        }
      } else {
        addHabit(habitPayload);
        if (onSubmit) {
          onSubmit();
        } else {
          navigate('/dashboard');
        }
      }
    }
  };

  const isFormValid = formData.name.trim().length >= 3 && formData.category && formData.frequency;

  return (
    <form className="add-habit-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Habit Name *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., Morning Meditation"
          className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
        />
        {touched.name && errors.name && (
          <span className="error-message">{errors.name}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency *</label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="form-select"
          >
            {FREQUENCIES.map(freq => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
          >
            {PRIORITIES.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group reminder-group">
        <div className="reminder-toggle">
          <label htmlFor="reminderEnabled">Send reminder</label>
          <input
            id="reminderEnabled"
            name="reminderEnabled"
            type="checkbox"
            checked={formData.reminderEnabled}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              reminderEnabled: e.target.checked
            }))}
          />
        </div>
        {formData.reminderEnabled && (
          <div className="reminder-time-row">
            <label htmlFor="reminderTime">Reminder Time</label>
            <input
              id="reminderTime"
              name="reminderTime"
              type="time"
              value={formData.reminderTime}
              onChange={handleChange}
              className="form-input"
            />
            {errors.reminderTime && (
              <span className="error-message">{errors.reminderTime}</span>
            )}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Color Tag</label>
        <div className="color-picker">
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              className={`color-option ${formData.color === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              title={color}
            >
              {formData.color === color && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add notes about your habit..."
          className="form-textarea"
          rows="3"
        ></textarea>
      </div>

      <button 
        type="submit" 
        className={`submit-btn ${!isFormValid ? 'disabled' : ''}`}
        disabled={!isFormValid}
      >
        {isEditing ? 'Update Habit' : 'Create Habit'}
      </button>
    </form>
  );
};
