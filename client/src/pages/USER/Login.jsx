import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./global.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import axios from "axios";

const Login = () => {
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

 // Function to handle form submission
 const handleLogin = async (e) => {
  e.preventDefault();
  
  const User = {
    password,
    email,
    
  };
  axios.post("http://localhost:5000/api/login", User)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));


      const response = await axios.post("http://localhost:5000/api/login", User);

    if (response.data.user) {
      sessionStorage.setItem("token", response.data.user);
      alert("Logged in");
      window.location.href = "/";
    } else {
      alert("Wrong credentials");
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

     


          <button type="submit">Log In</button>
          <a href="/forgot-password">Forgot Password?</a>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
