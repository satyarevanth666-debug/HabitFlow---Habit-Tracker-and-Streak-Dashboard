import React from 'react';
import '../styles/components/Modal.css';

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-cancel" onClick={onClose}>
            {cancelText}
          </button>
          {onConfirm && (
            <button 
              className={`modal-btn modal-confirm ${isDangerous ? 'modal-danger' : ''}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
