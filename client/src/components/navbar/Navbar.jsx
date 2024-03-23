import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './navbar.css'; 

const Navbar = memo(function Navbar({ className = '' }) {
 const [token, setToken] = useState(null);
 const navigate = useNavigate(); // Initialize useNavigate

 useEffect(() => {
    // Check for token in sessionStorage
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
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
        <a href="/" className="home">Home</a>
        <a href="/help" className="help">Help</a>
        <a href="/booking" className="reservation">Reservation</a>
        <a href="/contactus" className="contactUs">Contact Us</a>
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
