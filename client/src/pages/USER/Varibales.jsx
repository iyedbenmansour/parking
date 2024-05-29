import React, { useState,useEffect } from 'react';
import { useNavigate} from "react-router-dom"; // Import Link from react-router-dom
import { jwtDecode } from 'jwt-decode';

import axios from 'axios';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import AlertModal from '../../components/alert/AlertModal'; // Ensure this import is correct
import './global.css'; 

const Variable = ({ initialData, onSubmit }) => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState(initialData || {
    sfaxcap: '',
    djcap: '',
    ecop: '',
    luxp: '',
    hadp: '',
    sfaxcaplux: '',
    sfaxcapeco: '',
    sfaxcaphad: '',
    djcaphad: '',
    djcapeco: '',
    djcaplux: '',
  });
  const [fieldToUpdate, setFieldToUpdate] = useState('');
  // Declare state variables for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === 'admin') {
        setIsAdmin(true);
      } else {
        alert('You are not an admin');
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);


  const handleChange = (e) => {
    setFormData({
   ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFieldChange = (e) => {
    setFieldToUpdate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('http://localhost:5000/api/variables', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Success:', response.data);
      setModalMessage('Variable updated successfully!');
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000); // Close the modal after 2 seconds
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('Failed to update variable.');
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000); // Close the modal after 2 seconds
    }
  };

  return (
    <>
      <Navbar />
      <Header type="list" />
      <div className="mainContentArea">
        <form onSubmit={handleSubmit} className="bookingForm">
          <label>
            Select field to update:
            <select name="fieldToUpdate" value={fieldToUpdate} onChange={handleFieldChange} className="bookingForm select">
              <option value="" disabled>Select a field</option> 
              <option value="sfaxcap">Sfax–Thyna International Airport capacity</option>
              <option value="djcap">Djerba–Zarzis international Airport capacity</option>
              <option value="ecop">Economy Zone price</option>
              <option value="luxp">Premium Zone price</option>
              <option value="hadp">Handicap Zone price</option>
              <option value="sfaxcaplux">Sfax–Thyna International Airport Premium Zone capacity</option>
              <option value="sfaxcapeco">Sfax–Thyna International Airport Economy Zone capacity</option>
              <option value="sfaxcaphad">Sfax–Thyna International Airport Handicap Zone capacity</option>
              <option value="djcaphad">Djerba–Zarzis international Airport Handicap Zone capacity</option>
              <option value="djcapeco">Djerba–Zarzis international Airport Economy Zone capacity</option>
              <option value="djcaplux">Djerba–Zarzis international Airport Premium Zone capacity</option>
            </select>
          </label>
          {fieldToUpdate && (
            <label>
              {fieldToUpdate}:
              <input type="number" name={fieldToUpdate} value={formData[fieldToUpdate]} onChange={handleChange} className="bookingForm input" />
            </label>
          )}
          <button type="submit">Update</button>
        </form>
      </div>
      <Footer />
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={modalMessage} />
    </>
  );
};

export default Variable;
