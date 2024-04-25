import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Zonedash from "../../components/zonedash/Zonedash";
import Pricedash from "../../components/zonedash/Pricedash";
import Userdash from "../../components/zonedash/Userdash";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./admin.css"; 
import { jwtDecode } from 'jwt-decode'; 

export default function Admin() {
 const [isAdmin, setIsAdmin] = useState(false);
 const navigate = useNavigate();
 
 useEffect(() => {
     const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
     if (token) {
       const decodedToken = jwtDecode(token);
       if (decodedToken.role === 'admin') {
         setIsAdmin(true);
       } else {
         alert('You are not an admin');
         navigate('/'); // Redirect to home or any other page
       }
     } else {
       navigate('/'); // Redirect to home or any other page if no token is found
     }
 }, [navigate]);
 
 if (!isAdmin) {
     return null; }

 return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-split">
          <div className="dashboard-content">
            <button className="buttons-container" onClick={() => navigate('/admin')}>refresh data</button>
            <button className="buttons-container" onClick={() => navigate('/allbooking')}>All Bookings</button>
            <button className="buttons-container" onClick={() => navigate('/allticket')}>All Tickets</button>
            <button className="buttons-container" onClick={() => navigate('/alluser')}>All Users</button>
            <button className="buttons-container" onClick={() => navigate('/alladmin')}>all admins</button>

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
