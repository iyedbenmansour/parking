// Payment.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AlertModal from '../../components/alert/AlertModal';
import './global.css'; 
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';    
import Footer from '../../components/footer/Footer';
import BookingQRCode from '../../components/QRCodeDisplay/QRCodeDisplay';

export default function Payment() {
 const [token, setToken] = useState('');
 const [booking, setBooking] = useState({}); // Initialize as an object
 const [price, setPrice] = useState('');
 const [title, setTitle] = useState('');
 const [userInfo, setUserInfo] = useState({ name: '', email: '' });
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [modalMessage, setModalMessage] = useState('');

 const navigate = useNavigate();

 useEffect(() => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    sessionStorage.removeItem("token");
    navigate("/login");
  } else {
  }
}, [navigate]);


 useEffect(() => {
    const tokenFromStorage = sessionStorage.getItem('token');
    const bookingFromStorage = sessionStorage.getItem('booking');
    const priceFromStorage = sessionStorage.getItem('price');
    const titleFromStorage = sessionStorage.getItem('title');

    setToken(tokenFromStorage);
    setPrice(priceFromStorage);
    setTitle(titleFromStorage);

    if (bookingFromStorage) {
      try {
        const parsedBooking = JSON.parse(bookingFromStorage);
        setBooking(parsedBooking);
      } catch (error) {
        console.error('Error parsing booking information:', error);
      }
    }

    if (tokenFromStorage) {
      try {
        const decodedToken = jwtDecode(tokenFromStorage);
        const email = decodedToken.email;
        setUserInfo({ email });
        sessionStorage.setItem('email', email);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.log('Token not found in local storage');
    }
 }, []);

 const handleBooking = async (e) => {
  e.preventDefault();
  const newBooking = {
      carModel: booking.carModel,
      licensePlate: booking.licensePlate,
      bookingStartDate: booking.bookingStartDate,
      bookingEndDate: booking.bookingEndDate,
      price,
      title,
      email: userInfo.email,
  };
  try {
      const res = await axios.post("http://localhost:5000/api/booking", newBooking);
      console.log(res.data);
      // Booking is considered successful at this point
      setModalMessage("Booking done successfully.");
      setIsModalOpen(true);
      // Remove items from sessionStorage
      sessionStorage.removeItem('title');
      sessionStorage.removeItem('booking');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('price');
      // Redirect after a delay to allow the modal to be seen
      setTimeout(() => {
          window.location.href = "/booking";
      }, 2000);
  } catch (err) {
      console.error(err);
      setModalMessage("Booking done successfully, but email not sent.");
      setIsModalOpen(true);
      // Remove items from sessionStorage
      sessionStorage.removeItem('title');
      sessionStorage.removeItem('booking');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('price');
      // Redirect after a delay to allow the modal to be seen
      setTimeout(() => {
          window.location.href = "/booking";
      }, 2000);
  }
};


// Function to format booking information into a string
const formatBookingInfo = (booking, price, title, email) => {
    return `Airport parking: ${booking.carModel}\nLicense Plate: ${booking.licensePlate}\nFrom: ${booking.bookingStartDate}\nTo: ${booking.bookingEndDate}\nTotal cost: ${price} dt\nZone: ${title}\nEmail: ${email}`;
};

 return (
    <>
        <Navbar />
        <div className="mainContentArea">
            <div className="bookingForm">
                <h3>Booking info</h3>
                <p>Airport parking : {booking.carModel}</p>
                <p>License Plate: {booking.licensePlate}</p>
                <p>From: {booking.bookingStartDate}</p>
                <p>To: {booking.bookingEndDate}</p>
                <h3>Total cost</h3>
                <p>Price: {price} dt </p>
                <p>Zone: {title}</p>
                <h3>User Information</h3>
                <p>Email: {userInfo.email}</p>
                <h3>Booking QR Code</h3>
                <div className="qrCodeContainer">

                <BookingQRCode bookingInfo={formatBookingInfo(booking, price, title, userInfo.email)} />
                </div>
                <button className="confirmButton" onClick={handleBooking}>Confirm</button>
            </div>
        </div>
        <Footer />
        <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={modalMessage} />
    </>
 );
}
