import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./profile.css";
import { FaTrash } from "react-icons/fa";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";

function Profile() {
 const [bookings, setBookings] = useState([]);
 const [contacts, setContacts] = useState([]);
 const [user, setUser] = useState(null);

 useEffect(() => {
    const token = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    // Fetch contacts
    axios
      .get(`http://localhost:5000/api/contact?email=${email}`)
      .then((response) => {
        setContacts(response.data.contact.reverse());
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });

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
    axios
      .delete(`http://localhost:5000/api/bookings/${bookingId}`)
      .then((response) => {
        const updatedBookings = bookings.filter(
          (booking) => String(booking._id) !== String(bookingId)
        );
        setBookings(updatedBookings);
      })
      .catch((error) => {
        console.error("Error deleting booking:", error);
      });
 };

 const handleDeleteContact = (contactId) => {
    axios
      .delete(`http://localhost:5000/api/contacts/${contactId}`)
      .then((response) => {
        const updatedContacts = contacts.filter(
          (contact) => String(contact._id) !== String(contactId)
        );
        setContacts(updatedContacts);
      })
      .catch((error) => {
        console.error("Error deleting contact:", error);
      });
 };

 const navigate = useNavigate();

 const handleEdit = () => {
    navigate("/edit");
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
                />
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
            <span>Your ticket : </span>
            {contacts.map((contact, index) => (
              <div key={index} className="reservation-box">
                <FaTrash
                 className="delete-icon"
                 onClick={() => handleDeleteContact(contact._id)}
                />
                <p>Email: {contact.email}</p>
                <p>Error Type: {contact.errorType}</p>
                <p>Specific Error: {contact.specificError}</p>
                <p>Message: {contact.message}</p>
                <p>
                 Created At: {new Date(contact.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
 );
}

export default Profile;
