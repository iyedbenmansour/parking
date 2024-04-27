import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import AlertModal from "../../components/alert/AlertModal"; // Import AlertModal

const ForgetPassword = () => {
 const [email, setEmail] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [verificationCode, setVerificationCode] = useState("");
 const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
 const [showVerificationForm, setShowVerificationForm] = useState(false);
 const [message, setMessage] = useState("");
 const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

 // Function to handle modal open/close and message
 const handleModal = (isOpen, message) => {
    setIsModalOpen(isOpen);
    setMessage(message);
 };

 const sendVerificationCode = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/sendVerificationCode", { email }, { withCredentials: true });
      if (response.data.message === "Verification code sent successfully.") {
        setShowVerificationForm(true);
        handleModal(true, "Verification code sent successfully. Please check your email.");
      } else {
        handleModal(true, "Failed to send verification code.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      handleModal(true, "An error occurred while sending the verification code.");
    }
 };

 const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/checkEmail", { email });
      if (response.data.exists) {
        sendVerificationCode();
      } else {
        handleModal(true, "Email not found.");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      handleModal(true, "An error occurred while checking the email.");
    }
 };

 const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/verifyCode", { email, verificationCode }, { withCredentials: true });
      if (response.data.verified) {
        setShowVerificationForm(false);
        setShowNewPasswordForm(true);
        handleModal(true, "Verification successful. Please enter your new password.");
      } else {
        handleModal(true, "Verification code is incorrect.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      handleModal(true, "An error occurred while verifying the code.");
    }
 };

 const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      handleModal(true, "Please enter a new password.");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/forgetpassword/${email}`, { password: newPassword }, { withCredentials: true });
      if (response.data.message === "Password updated successfully") {
        handleModal(true, "Password updated successfully.");
        setShowNewPasswordForm(false);
        window.location.href = "/login";
      } else {
        handleModal(true, "Password update failed.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      handleModal(true, "An error occurred while updating the password.");
    }
 };

 return (
    <div>
      <Navbar />  
      <Header type="list" />  
      <div className="mainContentArea">
        {!showNewPasswordForm && !showVerificationForm ? (
          <form className="bookingForm" onSubmit={handleEmailSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="user@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        ) : showVerificationForm ? (
          <form className="bookingForm" onSubmit={handleVerificationSubmit}>
            <label htmlFor="verificationCode">Verification Code:</label>
            <input
              type="text"
              id="verificationCode"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button type="submit">Verify</button>
          </form>
        ) : (
          <form className="bookingForm" onSubmit={handlePasswordUpdate}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              placeholder="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Update Password</button>
          </form>
        )}
      </div>
      <Footer />  
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={message} /> {/* Use AlertModal */}
    </div>
 );
};

export default ForgetPassword;
