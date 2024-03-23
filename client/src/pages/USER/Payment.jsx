import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // Import axios
import './global.css'; 
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';    
import Footer from '../../components/footer/Footer';

export default function Payment() {
 const [token, setToken] = useState('');
 const [booking, setBooking] = useState({}); // Initialize as an object
 const [price, setPrice] = useState('');
 const [title, setTitle] = useState('');
 const [userInfo, setUserInfo] = useState({ name: '', email: '' });

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

 // Updated handleBooking function
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
    axios.post("http://localhost:5000/api/booking", newBooking)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));

    sessionStorage.removeItem('title');
    sessionStorage.removeItem('booking');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('price');
    alert("booking done succufully");

    window.location.href = "/booking";
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
        <button className="confirmButton" onClick={handleBooking}>Confirm</button> {/* Updated Confirm Button */}
      </div>
    </div>
    <Footer />
        </>
 );
}
