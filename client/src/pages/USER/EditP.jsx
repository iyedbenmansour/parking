import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import AlertModal from '../../components/alert/AlertModal';
import { jwtDecode } from 'jwt-decode'; // Fixed import statement
import './global.css';

export default function EditP() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');

  const [cin, setCin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const decodeTokenAndExtractEmail = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.id) {
          setId(decodedToken.id);
          setEmail(decodedToken.email);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle token decoding error
      }
    }
  };

  useEffect(() => {
    decodeTokenAndExtractEmail();
  }, []);

  const validateInputs = () => {
    if (fullName.length < 4) {
      throw new Error("Full name must be at least 4 characters long.");
    }
    if (!/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,}/.test(password)) {
      throw new Error("Password must be at least 5 characters long and contain at least one digit, one symbol, and one uppercase letter.");
    }
    if (!/^\d{8}$/.test(phoneNumber)) {
      throw new Error("Phone number must be exactly 8 digits long.");
    }
    if (!/^\d{8}$/.test(cin)) {
      throw new Error("Cin must be exactly 8 digits long.");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Invalid email address.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      validateInputs();
      const response = await axios.put(`http://localhost:5000/api/updateUser/${id}`, {
        fullName: fullName,
        phoneNumber: phoneNumber,
        cin: cin,
        password: password,
        email: email,
        id: id,
      });

      if (response.status === 200) {
        console.log("Profile updated successfully");
        setModalMessage("Profile updated successfully");
        setIsModalOpen(true);
        sessionStorage.clear();
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error("Failed to update profile");
        setModalMessage("Failed to update profile");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("An error occurred while updating the profile:", error.message);
      setModalMessage(error.message);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      <Header type={"list"} />
      <div className="mainContentArea">
        <div className="bookingForm">
          <h2>Edit Profile</h2>
          <form onSubmit={handleEdit}>
            <label>
              Full Name:
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='Full Name' />
            </label>

            <label>
              Email: 
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='user@example.com' />
            </label>

            <label>
              Cin:
              <input type="text" value={cin} onChange={(e) => setCin(e.target.value)} placeholder='Cin' />
            </label>

            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='*******'/>
            </label>

            <label>
              Phone Number:
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='xx xxx xxx' />
            </label>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>
      <Footer />
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={modalMessage} />
    </>
  );
}
