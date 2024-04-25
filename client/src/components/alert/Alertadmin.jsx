// AlertModal.js
import React from 'react';
import './AlertModal.css'; // You'll need to create this CSS file

const Alertadmin = ({ isOpen, onClose, primaryLabel, primaryOnClick, secondaryLabel, secondaryOnClick, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{message}</h3>
        <div className="button-container">
          <button onClick={primaryOnClick}>{primaryLabel}</button>
          <button onClick={secondaryOnClick}>{secondaryLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default Alertadmin;
