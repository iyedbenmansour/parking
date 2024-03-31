import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./admin.css"; 
import { FaTrash } from "react-icons/fa"; 
import { useNavigate, useLocation } from "react-router-dom"; 
import { jwtDecode } from 'jwt-decode'; 

const Allticket = () => {
 const navigate = useNavigate();
 const [contacts, setContacts] = useState([]);
 const [search, setSearch] = useState(""); // State to hold the search input
 
 useEffect(() => {
     const fetchContacts = async () => {
       try {
         const response = await axios.get("http://localhost:5000/api/contacts");
         setContacts(response.data.contacts.reverse());
       } catch (error) {
         console.error("Error fetching contacts:", error);
       }
     };
 
     fetchContacts();
 }, []);
 
 const handleDelete = async (contactId) => {
 try {
      await axios.delete(`http://localhost:5000/api/contacts/${contactId}`);

      setContacts(contacts.filter((contact) => contact._id !== contactId));

      console.log("Contact deleted successfully.");
 } catch (error) {
      console.error("Error deleting contact:", error);
      console.error("An error occurred while deleting the contact.");
 }
};

const handleSearch = (event) => {
     setSearch(event.target.value);
 };
 
 // Filter contacts by error type instead of by message
 const filteredContacts = contacts.filter((contact) =>
     contact.errorType.toLowerCase().includes(search.toLowerCase())
 );
 
 const resetSearch = () => {
    setSearch("");
 };
 
 return (
    <>
      <Navbar />
      <div className="admin-container">
        <h1 onClick={resetSearch}>Contact</h1>
        <input
          type="text"
          placeholder="Search by Error Type" // Updated placeholder text
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />
        {filteredContacts.length > 0 ? (
          <ul>
            {filteredContacts.map((contact, index) => (
              <li key={index} className="booking-item">
               <p>{contact.errorType}</p>
               <div className="booking-details">
                <p
                      className="email-link "
                      onClick={() => navigate(`/alluser?email=${contact.email}`)}
                 >
              Email: {contact.email}</p>
                <p>Error Type: {contact.errorType}</p>
                <p>Specific Error: {contact.specificError}</p>
                <p>Message: {contact.message}</p>
                <p>
                 Created At: {new Date(contact.createdAt).toLocaleDateString()}
                </p>
              </div>
                <FaTrash
                 className="delete-iconx"
                 onClick={() => handleDelete(contact._id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-contacts">No contacts found.</p>
        )}
      </div>
      <Footer />
    </>
 );
};

export default Allticket;
