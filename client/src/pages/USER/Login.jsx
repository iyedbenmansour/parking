import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./global.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import axios from "axios";
import AlertModal from "../../components/alert/AlertModal";
const Login = () => {
 const navigate = useNavigate();

 useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate('/');
    }
 }, [navigate]);

 // State for form inputs and modal
 const [password, setPassword] = useState("");
 const [email, setEmail] = useState("");
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [modalMessage, setModalMessage] = useState('');

 // Function to handle form submission
 const handleLogin = async (e) => {
    e.preventDefault();

    const User = {
      password,
      email,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/login", User);

      if (response.data.user) {
        sessionStorage.setItem("token", response.data.user);
        setModalMessage("Logged in successfully.");
        setIsModalOpen(true);
        setTimeout(() => {
          navigate('/');
          setIsModalOpen(false);
        }, 2000); // Close the modal and navigate after 2 seconds
      }
    } catch (err) {
      console.error(err);
      setModalMessage("Wrong credentials.");
      setIsModalOpen(true);
    }
 };

 return (
    <>
      <Navbar />
      <Header type="list" />
      <div className="mainContentArea">
        <form className="bookingForm" onSubmit={handleLogin}>
          <h2>Log In</h2>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            placeholder="user@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
          <a href="/register">create an account </a>
        </form>
      </div>
      <Footer />
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={modalMessage} />
    </>
 );
};

export default Login;
