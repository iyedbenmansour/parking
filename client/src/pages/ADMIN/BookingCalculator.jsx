import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Alertadmin from "../../components/alert/Alertadmin"; // Make sure this path matches your project structure
import './admin.css';

const BookingCalculator = () => {
  const [carModelData, setCarModelData] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookings, setBookings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/allbookings');
        const bookings = response.data.bookings;
        const currentDate = new Date();
        const filteredData = bookings.filter(booking => {
          const endDate = new Date(booking.bookingEndDate);
          return endDate >= currentDate;
        });
        setFilteredBookings(filteredData);
        const groupedBookings = filteredData.reduce((acc, booking) => {
          const carModel = booking.carModel;
          const title = booking.title;
          if (!acc[carModel]) {
            acc[carModel] = { total: 0, zones: { 'Handicap Zone': 0, 'Economy Zone': 0, 'Premium Zone': 0 } };
          }
          acc[carModel].total += 1;
          if (acc[carModel].zones[title]!== undefined) {
            acc[carModel].zones[title] += 1;
          }
          return acc;
        }, {});
        const formattedData = Object.entries(groupedBookings).map(([carModel, data]) => ({
          carModel,
          counts: {
            'Handicap Zone': data.zones['Handicap Zone'],
            'Economy Zone': data.zones['Economy Zone'],
            'Premium Zone': data.zones['Premium Zone']
          },
          total: data.total
        }));
        setCarModelData(formattedData);
        sessionStorage.setItem('carModelData', JSON.stringify(formattedData));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  const handleDeleteConfirmation = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowConfirmation(true);
  };

  const goToUserDetails = (email) => {
    navigate(`/alluser?email=${email}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingToDelete}`);
      setBookings(bookings.filter((booking) => booking._id!== bookingToDelete));
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="mainContentArea">
        <div className="bookingForm">
          <h2>Live Booking Counts by airport and zone</h2>
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
      <div className="mainContentArea">
        <div className="bookingForm">
          <h2>Live Booking</h2>
          {filteredBookings.length > 0? (
            <ul>
              {filteredBookings.map((booking, index) => (
                <li key={index} className="booking-item">
                  <p>{booking.licensePlate}</p>
                  <div className="booking-details">
                    <p className="email-link" onClick={() => goToUserDetails(booking.email)}>
                      Email: {booking.email}
                    </p>
                    <p>Airport: {booking.carModel}</p>
                    <p>Booking Start Date: {new Date(booking.bookingStartDate).toLocaleDateString()}</p>
                    <p>Booking End Date: {new Date(booking.bookingEndDate).toLocaleDateString()}</p>
                    <p>Price: {booking.price} dt</p>
                    <p>Title: {booking.title}</p>
                  </div>
                  <FaTrash className="delete-icon" onClick={() => handleDeleteConfirmation(booking._id)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-bookings">No bookings found.</p>
          )}
        </div>
      </div>
      <Alertadmin
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        primaryLabel="Confirm Delete"
        primaryOnClick={handleDelete}
        secondaryLabel="Cancel"
        secondaryOnClick={handleCloseConfirmation}
        message="Are you sure you want to delete this booking?"
      />
      <Footer />
    </div>
  );
};

export default BookingCalculator;
