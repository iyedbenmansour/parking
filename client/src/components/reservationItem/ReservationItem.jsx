// ReservationItem.jsx
import React from 'react';
import { format } from 'date-fns'; // Make sure to import the format function

const ReservationItem = ({ reservation }) => {
  // Format the date if needed
  const formattedDate = format(new Date(reservation.date), 'MM/dd/yyyy');

  return (
    <div className="reservationItem">
      <h3>Reservation Details</h3>
      <p>Reservation ID: {reservation.id}</p>
      <p>Name: {reservation.name}</p>
      <p>Email: {reservation.email}</p>
      <p>Phone Number: {reservation.phoneNumber}</p>
      <p>License Plate: {reservation.licensePlate}</p>
      <p>Date: {formattedDate}</p>
      <p>Status: {reservation.status}</p>
      {/* Add any additional details you want to display */}
    </div>
  );
};

export default ReservationItem;
