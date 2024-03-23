import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./admin.css"; // Import the CSS file
import { FaTrash } from "react-icons/fa"; // Import the FaTrash icon
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation from react-router-dom

const AllBook = () => {
  const navigater = useNavigate();
  const [errorType, setErrorType] = useState("");
  const [specificErrorOptions, setSpecificErrorOptions] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigater]);

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState(""); // State to hold the search input
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation
  const queryParams = new URLSearchParams(location.search); // Parse the query parameters
  const email = queryParams.get("email"); // Get the email query parameter

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/allbookings"
        );
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // Function to handle the search
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Filter bookings based on the search input and email query parameter
  const filteredBookings = bookings.filter(
    (booking) =>
      (booking.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
        booking.email.toLowerCase().includes(search.toLowerCase())) &&
      (!email || booking.email.toLowerCase() === email.toLowerCase())
  );

  // Reset search state when clicking on the header
  const resetSearch = () => {
    window.location.href = "/allbooking";
  };

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
                  onClick={() => handleDelete(booking._id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No bookings found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllBook;
