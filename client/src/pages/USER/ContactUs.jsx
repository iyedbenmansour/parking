import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './global.css';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

const ContactUs = () => {
 const navigate = useNavigate();
 const [errorType, setErrorType] = useState("");
 const [specificErrorOptions, setSpecificErrorOptions] = useState([]);
 const [specificError, setSpecificError] = useState("");
 const [message, setMessage] = useState("");

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

 const handleSpecificErrorChange = (e) => {
    setSpecificError(e.target.value);
 };

 const handleMessageChange = (e) => {
    setMessage(e.target.value);
 };

 const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      // Decode the token to get the user's email
      const token = sessionStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userEmail = decodedToken.email; // Assuming the email is stored in the token

      const response = await axios.post("http://localhost:5000/api/contact", {
        errorType,
        specificError,
        message,
        email: userEmail, // Include the user's email in the submission
      });

      if (response.status === 201) {
        alert("Contact form submitted successfully.");
        setErrorType("");
        setSpecificErrorOptions([]);
        setSpecificError("");
        setMessage("");
      }
    } catch (error) {
      console.error("An error occurred while submitting the contact form.", error);
      alert("An error occurred while submitting the contact form.");
    }
 };

 return (
    <>
      <Navbar />
      <div className="mainContentArea">
        <form className="bookingForm" onSubmit={handleSubmit}>
          <h2>Contact Us</h2>

          <label htmlFor="errorType">Type of Error:</label>
          <select id="errorType" name="errorType" value={errorType} onChange={handleErrorTypeChange}>
            <option value="">Select Error Type</option>
            <option value="payment">Payment Error</option>
            <option value="login">Login Error</option>
            {/* Add more error types here */}
          </select>

          {specificErrorOptions.length > 0 && (
            <>
              <label htmlFor="specificError">Specific Error:</label>
              <select id="specificError" name="specificError" value={specificError} onChange={handleSpecificErrorChange}>
                {specificErrorOptions.map((option) => (
                 <option key={option.value} value={option.value}>
                    {option.label}
                 </option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" value={message} onChange={handleMessageChange} />

          <button type="submit">Submit</button>
        </form>
      </div>
      <Footer/>
    </>
 );
};

export default ContactUs;
