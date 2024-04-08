import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./global.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import AlertModal from "../../components/alert/AlertModal"; // Import AlertModal

const Register = () => {
 const navigate = useNavigate();

 useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate('/');
    }
 }, [navigate]);

 // State for form inputs
 const [password, setPassword] = useState("");
 const [email, setEmail] = useState("");
 const [fullname, setFullName] = useState("");
 const [phoneNumber, setPhoneNumber] = useState("");
 const [cin, setCin] = useState("");

 // State for AlertModal
 const [isAlertOpen, setIsAlertOpen] = useState(false);
 const [alertMessage, setAlertMessage] = useState("");

 // Function to show AlertModal
 const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
 };

 // Function to close AlertModal
 const closeAlert = () => {
    setIsAlertOpen(false);
 };

 // Function to handle form submission
 const handleRegister = async (e) => {
    e.preventDefault();

    // Full name must be at least 4 characters
    if (fullname.length < 4) {
      showAlert("Full name must be at least 4 characters.");
      return;
    }

    // Email must be a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address.");
      return;
    }

    // Phone number must be exactly 8 digits
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showAlert("Phone number must be exactly 8 digits.");
      return;
    }

    // Password must be at least 5 characters long, contain at least one uppercase letter, one number, and one symbol
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    if (!passwordRegex.test(password)) {
      showAlert("Password must be at least 5 characters long, contain at least one uppercase letter, one number, and one symbol.");
      return;
    }

    // Identity document (CIN) must be exactly 8 digits
    const cinRegex = /^\d{8}$/;
    if (!cinRegex.test(cin)) {
      showAlert("Identity document must be exactly 8 digits.");
      return;
    }

    const newUser = {
      password,
      email,
      fullname,
      phoneNumber,
      cin
    };

    axios.post("http://localhost:5000/api/register", newUser)
      .then(res => {
        console.log(res.data);
        window.location.href = "/login";
      })
      .catch(err => {
        console.error(err);
        showAlert("An error occurred during registration. Please try again.");
      });
 };

 return (
    <>
      <Navbar />
      <Header type="list" />
      <div className="mainContentArea">
        <form className="bookingForm" onSubmit={handleRegister}>
          <h2>Register</h2>
          <label htmlFor="fullname">Full Name:</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="licensePlate">Identity document:</label>
          <input
            type="text"
            id="licensePlate"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
      <Footer />
      <AlertModal isOpen={isAlertOpen} onClose={closeAlert} message={alertMessage} /> {/* Render AlertModal */}
    </>
 );
};

export default Register;
