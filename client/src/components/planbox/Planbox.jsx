import React, { useState } from 'react';
import AlertModal from '../alert/AlertModal'; // Adjust the import path based on your project structure
import './planbox.css';

// PlanBox component
const PlanBox = ({ title, description, price, capacity }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  function handleClick(title, price) {
    // Convert price to a string with 2 decimal places
    const formattedPrice = price.toFixed(2);
    
    // Save both title and formatted price to sessionStorage
    sessionStorage.setItem('title', title);
    sessionStorage.setItem('price', formattedPrice);
    
    // Set the modal message and open the modal
    setModalMessage(`Price ${formattedPrice} dt will be your total price for ${title}`);
    setIsModalOpen(true);
  }
  

  return (
    <>
      <div className="plan-box">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="price-container">
        <button
  className="price-button"
  onClick={() => handleClick(title, price)}
  disabled={capacity === 0}
>
  Price: {price.toFixed(2)} dt
</button>

        </div>
        <p>Capacity: {capacity}</p>
      </div>
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); window.location.href = '/payment'; }}
        message={modalMessage}
      />
    </>
  );
};

export default PlanBox;
