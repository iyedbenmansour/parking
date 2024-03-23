import React, { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./profile.css";
import { FaTrash } from "react-icons/fa"; // Import the FaTrash icon
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer"; 

function Profile() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    // Fetch bookings
    axios
      .get(`http://localhost:5000/api/bookings?email=${email}`)
      .then((response) => {
        setBookings(response.data.bookings.reverse());
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });

    // Fetch user information
    axios
      .get(`http://localhost:5000/api/user/${email}`)
      .then((response) => {
        setUser(response.data.user);

      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, []);

  const handleDelete = (bookingId) => {
    console.log("Deleting booking with ID:", bookingId); // Add this line for debugging
    axios
      .delete(`http://localhost:5000/api/bookings/${bookingId}`)
      .then((response) => {
        // Filter out the deleted booking
        const updatedBookings = bookings.filter(
          (booking) => String(booking._id) !== String(bookingId)
        );
        setBookings(updatedBookings);
      })
      .catch((error) => {
        console.error("Error deleting booking:", error);
      });
  };

  const navigate = useNavigate();

  const handleEdit = () => {
     navigate('/edit');
  };
 

  return (
    <>
      <Navbar />
      <div className="containerBox">
        <div className="adjust">
          <div className="reservations">
            <span className="tiles">Reservation history :</span>
            {bookings.map((booking, index) => (
              <div key={index} className="reservation-box">
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDelete(booking._id)}
                />{" "}
                {/* Corrected to use booking._id */}
                <p>Car Model: {booking.carModel}</p>
                <p>License Plate: {booking.licensePlate}</p>
                <p>
                  Booking Start Date:{" "}
                  {new Date(booking.bookingStartDate).toLocaleDateString()}
                </p>
                <p>
                  Booking End Date:{" "}
                  {new Date(booking.bookingEndDate).toLocaleDateString()}
                </p>
                <p>Price: {booking.price}</p>
                <p>Title: {booking.title}</p>
              </div>
            ))}
          </div>
          <div className="profiles">
            <span>Your information : </span>
            {user && (
              <div>
                <p>Full Name: {user.fullname}</p>
                <p>Email: {user.email}</p>
                <p>Phone Number: {user.phoneNumber}</p>
                <p>CIN: {user.cin}</p>
                <p>Role: {user.role}</p>

              </div>
            )}
                <button className="edit-info-btn" onClick={handleEdit}>Edit Information</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
