import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import{jwtDecode } from 'jwt-decode'; // Import jwtDecode for decoding the token
import './navbar.css'; 

const Navbar = memo(function Navbar({ className = '' }) {
 const [token, setToken] = useState(null);
 const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
 const navigate = useNavigate(); // Initialize useNavigate

 useEffect(() => {
    // Check for token in sessionStorage
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken);
      if (decodedToken.role === 'admin') {
        setIsAdmin(true);
      }
    }
 }, []);

 // Logout function
 const handleLogout = () => {
 sessionStorage.clear(); // Remove all items from sessionStorage
 setToken(null); // Update the token state
 navigate('/login'); // Navigate to the login page
};

 return (
    <div className="root">
      <div className="frame4"></div>
      <div className="frame1">
      {isAdmin ? (
          <a href="/admin" className="reservation">Dashboard</a> // Show "Dashboard" if user is admin
        ) : (
        <a href="/" className="home">Home</a>
        )}
        {isAdmin ? (
          <a href="/allticket" className="reservation">tickets</a> // Show "Dashboard" if user is admin
        ) : (
          <a href="/help" className="help">Help</a> // Show "Help" if user is not admin
        )}
          {isAdmin ? (
          <a href="/alluser" className="reservation">users</a> // Show "Dashboard" if user is admin
        ) : (
        <a href="/booking" className="reservation">Reservation</a>
        )}
         {isAdmin ? (
          <a href="/allbooking" className="reservation">bookings</a> // Show "Dashboard" if user is admin
        ) : (
        <a href="/contactus" className="contactUs">Contact Us</a>
        )}
      </div>
      <div className="frame3">
        {token ? (
          <>
            <div className="frame2">
              <a href="/profile" className="signIn">Profile</a>
            </div>
            <div className="frame32">
              <button onClick={handleLogout} className="signUp">Log Out</button>
            </div>
          </>
        ) : (
          <>
            <div className="frame2">
              <a href="/login" className="signIn">Sign In</a>
            </div>
            <div className="frame32">
              <a href="/register" className="signUp">Sign Up</a>
            </div>
          </>
        )}
      </div>
    </div>
 );
});

export default Navbar;
