import React, { useState } from 'react';
import AlertModal from '../alert/AlertModal'; // Adjust the import path based on your project structure
import './planbox.css';

// PlanBox component
const PlanBox = ({ title, description, price }) => {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [modalMessage, setModalMessage] = useState('');

 function handleClick(title, price) {
    // Save both title and price to sessionStorage
    sessionStorage.setItem('title', title);
    sessionStorage.setItem('price', price.toFixed(2));
    // Set the modal message and open the modal
    setModalMessage(`Price ${price.toFixed(2)} dt will be your total price for ${title}`);
    setIsModalOpen(true);
 }

 return (
  <>
    <div className="plan-box">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="price-container">
        <button className="price-button" onClick={() => handleClick(title, price)}>
          Price: {price.toFixed(2)} dt
        </button>
      </div>
    </div>
          <AlertModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); window.location.href = '/payment'; }} message={modalMessage} />
          </>
 );
};

export default PlanBox;
