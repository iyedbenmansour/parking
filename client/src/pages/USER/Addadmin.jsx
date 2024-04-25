  import React, { useState , useEffect} from "react";
  import { useNavigate } from "react-router-dom";
  import axios from 'axios'
  import "./global.css";
  import { jwtDecode } from 'jwt-decode';

  import Navbar from "../../components/navbar/Navbar";
  import Header from "../../components/header/Header";
  import Footer from "../../components/footer/Footer";

  const Addadmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();



    useEffect(() => {
      const token = sessionStorage.getItem('token');
      const adminCode = prompt('Please enter the admin code:');
    
      if (adminCode) { // Ensure the admin code is not null or empty
        axios.get('http://localhost:5000/getSecretKey')
          .then(response => {
            const { secretKey } = response.data;
            console.log('secretKey: ', secretKey);
            if (adminCode === secretKey) {
              // Admin code is correct
              if (token) {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role === 'admin') {
                  setIsAdmin(true);
                } else {
                  alert('You are not an admin');
                  navigate('/');
                }
              } else {
                // If there's no token, set isAdmin to true
                setIsAdmin(true);
              }
            } else {
              // Incorrect admin code
              alert('Incorrect admin code. Redirecting...');
              navigate('/alladmin');
            }
          })
          .catch(error => {
            console.error('Error fetching secret key:', error);
            // Handle error
          });
      } else {
        // Admin code not provided
        alert('Admin code is required. Redirecting...');
        navigate('/alladmin');
      }
    }, [navigate]);


    // State for form inputs
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [cin, setCin] = useState("");
    const [role, setRole] = useState("");


  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    const newUser = {
      password,
      email,
      fullname,
      phoneNumber,
      cin,
      role
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
              placeholder="admin full name"
              required
            />

          
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemple.com"
              required
            />


            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="8 degits "
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />

      

            <label htmlFor="licensePlate">Identity document:</label>
            <input
              type="text"
              id="licensePlate"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
              placeholder="CIN"
              required
            />

  <label htmlFor="role">Role:</label>
  <select
    id="role"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    required
  >
    <option value="">Select Role</option>
    <option value="admin">Admin</option>
    <option value="user">User</option>
  </select>



            


            <button type="submit">Register</button>

          </form>
        </div>
        <Footer />
      </>
    );
  };

  export default Addadmin;
