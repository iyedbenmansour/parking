import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./profile.css";
import { FaTrash } from "react-icons/fa";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import Alertadmin from "../../../components/alert/Alertadmin"; // Adjust the import path as necessary

function Profile() {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control the confirmation dialog
  const [itemToDelete, setItemToDelete] = useState({type: '', id: ''}); // State to store the type and ID of the item to be deleted

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (typeof token === "string") {
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
    } else {
      console.error("Token is not a string:", token);
    }
  }, []);

  const handleDelete = (type, itemId) => {
    setItemToDelete({type, id: itemId});
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      let url = '';
      if (itemToDelete.type === 'booking') {
        url = `http://localhost:5000/api/bookings/${itemToDelete.id}`;
      } else if (itemToDelete.type === 'contact') {
        url = `http://localhost:5000/api/contacts/${itemToDelete.id}`;
      }
      await axios.delete(url);
      if (itemToDelete.type === 'booking') {
        setBookings(bookings.filter((booking) => String(booking._id)!== String(itemToDelete.id)));
      } else if (itemToDelete.type === 'contact') {
        setContacts(contacts.filter((contact) => String(contact._id)!== String(itemToDelete.id)));
      }
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Navbar />
      <p className="welcome">Welcome {user?.fullname}</p>
      <div className="containerBox">
        <div className="userinfo">
          <div className="reservation-box">
            {user && (
              <div className="user-data">
                <h2>Your personal information</h2>
                <div className="profiles">
                  <p>Name: {user.fullname}</p>
                </div>
                <div className="profiles">
                  <p>Email: {user.email}</p>
                </div>
                <div className="profiles">
                  <p>Phone Number: {user.phoneNumber}</p>
                </div>
                <button onClick={() => navigate("/edit")}>Edit Profile</button>
              </div>
            )}
          </div>
        </div>
        <div className="adjust">
          <div className="reservations">
            <span className="tiles">Reservation history :</span>
            {bookings.map((booking, index) => (
              <div key={index} className="reservation-box">
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDelete('booking', booking._id)}
                />
                <p>Airport : {booking.carModel}</p>
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

          <div className="reservations">
            <span className="tiles">Your ticket : </span>
            {contacts.map((contact, index) => (
              <div key={index} className="reservation-box">
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDelete('contact', contact._id)}
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
      <Alertadmin
        isOpen={showConfirmation}
        onClose={cancelDelete}
        primaryLabel="Confirm"
        primaryOnClick={confirmDelete}
        secondaryLabel="Cancel"
        secondaryOnClick={cancelDelete}
        message="Are you sure you want to delete this item?"
      />
      <Footer />
    </>
  );
}

export default Profile;
