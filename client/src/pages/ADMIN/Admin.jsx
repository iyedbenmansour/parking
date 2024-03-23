import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Zonedash from "../../components/zonedash/Zonedash";
import Pricedash from "../../components/zonedash/Pricedash";
import Userdash from "../../components/zonedash/Userdash";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./admin.css"; // Import the CSS file
import { jwtDecode } from 'jwt-decode';

export default function Admin() {
  const navigate = useNavigate();
 const [errorType, setErrorType] = useState("");
 const [specificErrorOptions, setSpecificErrorOptions] = useState([]);

 useEffect(() => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    sessionStorage.removeItem("token");
    navigate("/login");
  } else {
    // Decode the token using jwt-decode
    try {
      const decodedToken = jwtDecode(token);
      // Check if the role is 'admin'
      if (decodedToken && decodedToken.role === 'admin') {
        // If the user is an admin, allow them to proceed
        // No need to do anything here, just let the user proceed
      } else {
        // If the user is not an admin, redirect them to a different page
        alert('You are not in an admin zone.');
        navigate('/'); // Redirect to home or any other page
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      // Handle the error, e.g., redirect to login or show an error message
      navigate("/login");
    }
  }
}, [navigate]);
 
  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-split">
          <div className="dashboard-content">
            <button className="buttons-container">All Users</button>
            <button className="buttons-container">All Bookings</button>
            <button className="buttons-container">All Tickets</button>
            <button className="buttons-container">Reserve Space</button>
            <button className="buttons-container">Check Admins</button>
          </div>
          <div className="dashboard-content">
            <Userdash />
          </div>
        </div>

        <div className="dashboard-split">
          <div className="dashboard-content">
            <Zonedash />
          </div>
          <div className="dashboard-content">
            <Pricedash />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
