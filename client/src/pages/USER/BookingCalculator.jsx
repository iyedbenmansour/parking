import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingCalculator = () => {
  const [carModelData, setCarModelData] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/allbookings');
        const bookings = response.data.bookings;

        const groupedBookings = bookings.reduce((acc, booking) => {
          const carModel = booking.carModel;
          const title = booking.title;

          if (!acc[carModel]) {
            acc[carModel] = { total: 0, zones: { 'Handicap Zone': 0, 'Economy Zone': 0, 'Premium Zone': 0 } };
          }

          acc[carModel].total += 1;

          if (acc[carModel].zones[title] !== undefined) {
            acc[carModel].zones[title] += 1;
          }

          return acc;
        }, {});

        const carModelData = Object.entries(groupedBookings).map(([carModel, data]) => {
          const { total, zones } = data;
          return {
            carModel,
            counts: {
              'Handicap Zone': zones['Handicap Zone'],
              'Economy Zone': zones['Economy Zone'],
              'Premium Zone': zones['Premium Zone']
            },
            total
          };
        });

        setCarModelData(carModelData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Booking Counts by  airport and Zone</h2>
      {carModelData.map(({ carModel, counts, total }, index) => (
        <div key={index}>
          <h3>{carModel}</h3>
          <p>Total Bookings: {total}</p>
          <p>Handicap Zone: {counts['Handicap Zone']}</p>
          <p>Economy Zone: {counts['Economy Zone']}</p>
          <p>Premium Zone: {counts['Premium Zone']}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default BookingCalculator;
