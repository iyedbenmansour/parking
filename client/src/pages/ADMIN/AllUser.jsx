import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Alertadmin from "../../components/alert/Alertadmin"; // Import Alertadmin
import { FaTrash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const AllUsers = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control the confirmation dialog
  const [userToDelete, setUserToDelete] = useState(null); // State to store the ID of the user to be deleted

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

  const handleDeleteConfirmation = (userId) => {
    setShowConfirmation(true); // Show the confirmation dialog
    setUserToDelete(userId); // Set the ID of the user to be deleted
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userToDelete}`);
      setUsers(users.filter((user) => user._id !== userToDelete));
      setShowConfirmation(false); // Hide the confirmation dialog after successful deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const resetSearch = () => {
    setSearch("");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.role === 'user' && // Filter only users with role 'user'
      (user.fullname.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())) &&
      (!email || user.email.toLowerCase() === email.toLowerCase())
  );
  
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h1 onClick={resetSearch}>Users</h1>
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
                  onClick={() => handleDeleteConfirmation(user._id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No users found.</p>
        )}
      </div>
      <Footer />
      {/* Confirmation Dialog */}
      <Alertadmin
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        primaryLabel="Confirm"
        primaryOnClick={handleDelete}
        secondaryLabel="Cancel"
        secondaryOnClick={() => setShowConfirmation(false)}
        message="Are you sure you want to delete this user?"
      />
    </>
  );
};

export default AllUsers;
