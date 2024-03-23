// Sidebar.jsx
import React from "react";
import "./sidebar.css"; // Import the CSS file for the Sidebar

const Sidebar = ({ onAddCar, onRemoveCar }) => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <button onClick={onAddCar}>Add Car</button>
      <button onClick={onRemoveCar}>Remove Car</button>
    </div>
  );
};

export default Sidebar;
