import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import "./global.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const Register = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate('/');
    } else {
      
    }
  }, [navigate]);


  // State for form inputs
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cin, setCin] = useState("");


 // Function to handle form submission
 const handleRegister = async (e) => {
  e.preventDefault();
  
  const newUser = {
    password,
    email,
    fullname,
    phoneNumber,
    cin
  };

  axios.post("http://localhost:5000/api/register", newUser)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));

     window.location.href = "/login";
};

  return (
    <>
      <Navbar />
      <Header type="list" />
      <div className="mainContentArea">
        <form className="bookingForm" onSubmit={handleRegister}>
          <h2>Register</h2>
      
          <label htmlFor="fullname">Full Name:</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

        
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />


          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

     

          <label htmlFor="licensePlate">Identity document:</label>
          <input
            type="text"
            id="licensePlate"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
