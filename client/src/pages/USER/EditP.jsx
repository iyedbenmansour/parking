import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

export default function EditP() {
 const [fullName, setFullName] = useState('');
 const [email, setEmail] = useState('');
 const [phoneNumber, setPhoneNumber] = useState('');
 const navigate = useNavigate();

 const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/api/updateUser', {
        fullname: fullName,
        email,
        phoneNumber,
        // Include cin if required
      });

      if (response.status === 200) {
        console.log("Profile updated successfully");
        navigate('/profile');
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
    }
 };

 return (
  <>
  <Navbar/>
  <Header type={"list"}/>
    <div className="containerBox">
      <h2>Edit Profile</h2>
      <form onSubmit={handleEdit}>
        <label>
          Full Name:
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Phone Number:
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
    <Footer/>
    </>
 );
}
