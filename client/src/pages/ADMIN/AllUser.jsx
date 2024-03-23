import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./admin.css"; // Import the CSS file
import { FaTrash } from "react-icons/fa"; // Import the FaTrash icon
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation from react-router-dom

const AllUsers = () => {
  const navigater = useNavigate();
  const [errorType, setErrorType] = useState("");
  const [specificErrorOptions, setSpecificErrorOptions] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigater]);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); // State to hold the search input
  const [isSearchActive, setIsSearchActive] = useState(false); // State to track if search is active
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation
  const queryParams = new URLSearchParams(location.search); // Parse the query parameters
  const email = queryParams.get("email"); // Get the email query parameter

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

  // Reset search state when clicking on the header
  const resetSearch = () => {
    window.location.href = "/alluser";
  };

  // Filter users based on the search input and email query parameter
  const filteredUsers = users.filter(
    (user) =>
      (isSearchActive &&
        (user.fullname.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()))) ||
      (!isSearchActive &&
        (!email || user.email.toLowerCase() === email.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h1 onClick={resetSearch}>Users</h1>{" "}
        {/* Add onClick handler to reset search */}
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
          <p className="no-bookings">No users found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllUsers;
