import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './global.css';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const ContactUs = () => {
 const navigate = useNavigate();
 const [errorType, setErrorType] = useState("");
 const [specificErrorOptions, setSpecificErrorOptions] = useState([]);

 useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      sessionStorage.removeItem("token");
      navigate('/login');
    }
 }, [navigate]);

 const handleErrorTypeChange = (e) => {
    setErrorType(e.target.value);
    switch (e.target.value) {
      case "payment":
        setSpecificErrorOptions([
          { value: "insufficientFunds", label: "Insufficient Funds" },
          { value: "cardDeclined", label: "Card Declined" },
          // Add more payment-related options here
        ]);
        break;
      case "login":
        setSpecificErrorOptions([
          { value: "wrongPassword", label: "Wrong Password" },
          { value: "accountLocked", label: "Account Locked" },
          // Add more login-related options here
        ]);
        break;
      default:
        setSpecificErrorOptions([]);
    }
 };

 return (
    <>
      <Navbar />
      <div className="mainContentArea">
        <form className="bookingForm">
          <h2>Contact Us</h2>

          <label htmlFor="errorType">Type of Error:</label>
          <select id="errorType" name="errorType" onChange={handleErrorTypeChange}>
            <option value="">Select Error Type</option>
            <option value="payment">Payment Error</option>
            <option value="login">Login Error</option>
            {/* Add more error types here */}
          </select>

          {specificErrorOptions.length > 0 && (
            <>
              <label htmlFor="specificError">Specific Error:</label>
              <select id="specificError" name="specificError">
                {specificErrorOptions.map((option) => (
                 <option key={option.value} value={option.value}>
                    {option.label}
                 </option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" />

          <button type="submit">Submit</button>
        </form>
      </div>
      <Footer/>
    </>
 );
};

export default ContactUs;
