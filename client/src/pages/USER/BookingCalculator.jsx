import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Category from "./Cattegory";
import './global.css'; 

const BookingCalculator = () => {
  const [carModelData, setCarModelData] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/allbookings');
        const bookings = response.data.bookings;

        const currentDate = new Date();

        const groupedBookings = bookings.reduce((acc, booking) => {
          const carModel = booking.carModel;
          const title = booking.title;
          const endDate = new Date(booking.bookingEndDate);

          // Check if endDate is not less than the current date
          if (endDate >= currentDate) {
            if (!acc[carModel]) {
              acc[carModel] = { total: 0, zones: { 'Handicap Zone': 0, 'Economy Zone': 0, 'Premium Zone': 0 } };
            }

            acc[carModel].total += 1;

            if (acc[carModel].zones[title] !== undefined) {
              acc[carModel].zones[title] += 1;
            }
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

        // Store carModelData in sessionStorage
        sessionStorage.setItem('carModelData', JSON.stringify(carModelData));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="mainContentArea">
        <div className="bookingForm">
          <h2>live Booking Counts by Airport and Zone</h2>
          {carModelData.map(({ carModel, counts, total }, index) => (
            <div key={index} className="carModelSection">
              <h3>{carModel}</h3>
              <div className="bookingCounts">
                <p>Total Bookings: {total}</p>
                <div className="zoneCount">
                  <p>Handicap Zone: {counts['Handicap Zone']}</p>
                  <p>Economy Zone: {counts['Economy Zone']}</p>
                  <p>Premium Zone: {counts['Premium Zone']}</p>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <Category carModelData={carModelData} /> {/* Pass data to Category */}

    </div>
  );
};

export default BookingCalculator;
