import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './global.css';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import AlertModal from "../../components/alert/AlertModal";


const ContactUs = () => {
 const navigate = useNavigate();
 const [errorType, setErrorType] = useState("");
 const [specificErrorOptions, setSpecificErrorOptions] = useState([]);
 const [specificError, setSpecificError] = useState("");
 const [message, setMessage] = useState("");
 const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
 const [modalMessage, setModalMessage] = useState(""); // State for modal message

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
        { value: "expiredCard", label: "Expired Card" },
        { value: "cardNotSupported", label: "Card Not Supported" },
        { value: "transactionFailed", label: "Transaction Failed" },
        // Add more payment-related options here
      ]);
      break;
    case "login":
      setSpecificErrorOptions([
        { value: "wrongPassword", label: "Wrong Password" },
        { value: "accountLocked", label: "Account Locked" },
        { value: "emailNotVerified", label: "Email Not Verified" },
        { value: "accountNotFound", label: "Account Not Found" },
        { value: "passwordResetRequired", label: "Password Reset Required" },
        // Add more login-related options here
      ]);
      break;
    case "register":
      setSpecificErrorOptions([
        { value: "emailAlreadyInUse", label: "Email Already In Use" },
        { value: "usernameAlreadyTaken", label: "Username Already Taken" },
        { value: "invalidEmailFormat", label: "Invalid Email Format" },
        { value: "passwordTooWeak", label: "Password Too Weak" },
        { value: "termsNotAccepted", label: "Terms Not Accepted" },
        // Add more register-related options here
      ]);
      break;
    case "parking":
      setSpecificErrorOptions([
        { value: "expiredTicket", label: "Expired Ticket" },
        { value: "invalidLocation", label: "Invalid Location" },
        { value: "noParkingZone", label: "No Parking Zone" },
        { value: "overstayed", label: "Overstayed" },
        { value: "meterExpired", label: "Meter Expired" },
        { value: "incorrectPayment", label: "Incorrect Payment" },
        // Add more parking-related options here
      ]);
      break;
    case "adminReport":
      setSpecificErrorOptions([
        { value: "userComplaint", label: "User Complaint" },
        { value: "systemIssue", label: "System Issue" },
        { value: "dataInconsistency", label: "Data Inconsistency" },
        { value: "securityViolation", label: "Security Violation" },
        { value: "featureRequest", label: "Feature Request" },
        // Add more admin report-related options here
      ]);
      break;
    case "bugReport":
      setSpecificErrorOptions([
        { value: "crashReport", label: "Crash Report" },
        { value: "performanceIssue", label: "Performance Issue" },
        { value: "uiGlitch", label: "UI Glitch" },
        { value: "featureBug", label: "Feature Bug" },
        { value: "securityFlaw", label: "Security Flaw" },
        // Add more bug report-related options here
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
      const userEmail = decodedToken.email; //  email is stored in the token

      const response = await axios.post("http://localhost:5000/api/contact", {
        errorType,
        specificError,
        message,
        email: userEmail, // Include the user's email in the submission
      });

      if (response.status === 201) {
        setModalMessage("Contact form submitted successfully.");
        setIsModalOpen(true);
        setErrorType("");
        setSpecificErrorOptions([]);
        setSpecificError("");
        setMessage("");
      }
    } catch (error) {
      console.error("An error occurred while submitting the contact form.", error);
      setModalMessage("An error occurred while submitting the contact form.");
      setIsModalOpen(true);
    }
 };

 const closeModal = () => {
    setIsModalOpen(false);
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
            <option value="register">register Error</option>

            <option value="parking">parking Error</option>
            <option value="adminReport">adminReport Error</option>
            <option value="bugReport">bugReport Error</option>

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
      <AlertModal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />

    </>
 );
};

export default ContactUs;
