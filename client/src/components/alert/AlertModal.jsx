// AlertModal.js
import React from 'react';
import './AlertModal.css'; // You'll need to create this CSS file

const AlertModal = ({ isOpen, onClose, message }) => {
 if (!isOpen) return null;

 return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{message}</h3>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
 );
};

export default AlertModal;
