import React from 'react';
import './planbox.css'; // Assuming you have a CSS file named PlanBox.css for styling

// PlanBox component
const PlanBox = ({ title, description, price }) => {
 return (
    <div className="plan-box">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="price-container">
        <button className="price-button" onClick={() => handleClick(title, price)}>
          Price: {price.toFixed(2)} dt
        </button>
      </div>
    </div>
 );

 function handleClick(title, price) {
    // Save both title and price to sessionStorage
    sessionStorage.setItem('title', title);
    sessionStorage.setItem('price', price.toFixed(2));
    alert(`Price ${price.toFixed(2)} dt will be your total price for ${title}`);
    window.location.href = '/payment';
 }
};

export default PlanBox;
