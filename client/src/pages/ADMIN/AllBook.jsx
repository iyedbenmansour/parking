import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./admin.css"; 
import { FaTrash } from "react-icons/fa"; 
import { useNavigate, useLocation } from "react-router-dom"; 
import { jwtDecode } from 'jwt-decode'; 

const AllBook = () => {
 const [isAdmin, setIsAdmin] = useState(false);
 const navigate = useNavigate();
 const location = useLocation(); // Move useLocation to the top level
 const queryParams = new URLSearchParams(location.search); // Parse the query parameters
 const email = queryParams.get("email"); // Get the email query parameter
 const [bookings, setBookings] = useState([]);
 const [search, setSearch] = useState(""); // State to hold the search input

 useEffect(() => {
     const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
     if (token) {
       const decodedToken = jwtDecode(token);
       if (decodedToken.role === 'admin') {
         setIsAdmin(true);
       } else {
         alert('You are not an admin');
         navigate('/'); // Redirect to home or any other page
       }
     } else {
       navigate('/'); // Redirect to home or any other page if no token is found
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

 const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
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
