import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Alertadmin from "../../components/alert/Alertadmin";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const AllBook = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control the confirmation dialog
  const [bookingToDelete, setBookingToDelete] = useState(null); // State to store the ID of the booking to be deleted
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === 'admin') {
        setIsAdmin(true);
      } else {
        alert('You are not an admin');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/allbookings"
        );
        setBookings(response.data.bookings.reverse());
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleDeleteConfirmation = (bookingId) => {
    setShowConfirmation(true); // Show the confirmation dialog
    setBookingToDelete(bookingId); // Set the ID of the booking to be deleted
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingToDelete}`);
      setBookings(bookings.filter((booking) => booking._id !== bookingToDelete));
      setShowConfirmation(false); // Hide the confirmation dialog after successful deletion
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      (booking.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
        booking.email.toLowerCase().includes(search.toLowerCase())) &&
      (!email || booking.email.toLowerCase() === email.toLowerCase())
  );

  const resetSearch = () => {
    window.location.href = "/allbooking";
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h1 onClick={resetSearch}>Bookings</h1>
        <input
          type="text"
          placeholder="Search by License Plate or Email"
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />
        {filteredBookings.length > 0 ? (
          <ul>
            {filteredBookings.map((booking, index) => (
              <li key={index} className="booking-item">
                <p>{booking.licensePlate}</p>
                <div className="booking-details">
                  <p
                    className="email-link "
                    onClick={() => navigate(`/alluser?email=${booking.email}`)}
                  >
                    Email: {booking.email}
                  </p>
                  <p>Airport: {booking.carModel}</p>
                  <p>
                    Booking Start Date:{" "}
                    {new Date(booking.bookingStartDate).toLocaleDateString()}
                  </p>
                  <p>
                    Booking End Date:{" "}
                    {new Date(booking.bookingEndDate).toLocaleDateString()}
                  </p>
                  <p>Price: {booking.price} dt</p>
                  <p>Title: {booking.title}</p>
                </div>
                <FaTrash
                  className="delete-iconx"
                  onClick={() => handleDeleteConfirmation(booking._id)} // Open confirmation dialog on click
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No bookings found.</p>
        )}
      </div>
      <Footer />
      {/* Confirmation Dialog */}
      <Alertadmin
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        primaryLabel="Confirm"
        primaryOnClick={handleDelete} // Handle deletion on confirmation
        secondaryLabel="Cancel"
        secondaryOnClick={() => setShowConfirmation(false)}
        message="Are you sure you want to delete this booking?"
      />
    </>
  );
};

export default AllBook;
