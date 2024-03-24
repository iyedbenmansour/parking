import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./admin.css"; 
import { FaTrash } from "react-icons/fa"; 
import { useNavigate, useLocation } from "react-router-dom"; 
import { jwtDecode } from 'jwt-decode'; 

const AllAdmins = () => {
 const [isAdmin, setIsAdmin] = useState(false);
 const navigate = useNavigate();
 const location = useLocation(); // Move useLocation to the top level
 const queryParams = new URLSearchParams(location.search); // Parse the query parameters
 const email = queryParams.get("email"); // Get the email query parameter
 const [users, setUsers] = useState([]);
 const [search, setSearch] = useState(""); // State to hold the search input
 const [isSearchActive, setIsSearchActive] = useState(false); // State to track if search is active

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

 useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/allusers");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
 }, []);

 const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
 };

 const handleSearch = (event) => {
    setSearch(event.target.value);
    setIsSearchActive(true); // Set search as active when typing
 };

 const resetSearch = () => {
    window.location.href = "/alladmin"; // Updated to navigate to /alladmin
 };

 // Filter users to show only those with an 'admin' role
 const filteredUsers = users.filter(
    (user) => user.role === 'admin' &&
      (isSearchActive &&
        (user.fullname.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()))) ||
      (!isSearchActive &&
        (!email || user.email.toLowerCase() === email.toLowerCase()))
 );

 if (!isAdmin) {
     return null;
 }

 return (
    <>
      <Navbar />
      <div className="admin-container">
        <h1 onClick={resetSearch}>Admins</h1>{" "}
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user, index) => (
              <li key={index} className="booking-item">
                <p>{user.fullname}</p>
                <div className="booking-details">
                 <p
                    className="email-link "
                    onClick={() => navigate(`/allbooking?email=${user.email}`)}
                 >
                    Email: {user.email}
                 </p>
                 <p>Phone Number: {user.phoneNumber}</p>
                 <p>CIN: {user.cin}</p>
                </div>
                <FaTrash
                 className="delete-iconx"
                 onClick={() => handleDelete(user._id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No admins found.</p>
        )}
      </div>
      <Footer />
    </>
 );
};

export default AllAdmins;
