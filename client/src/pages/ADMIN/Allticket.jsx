import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Alertadmin from "../../components/alert/Alertadmin"; // Import Alertadmin
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Allticket = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control the confirmation dialog
  const [contactToDelete, setContactToDelete] = useState(null); // State to store the ID of the contact to be deleted

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

  const handleDeleteConfirmation = (contactId) => {
    setShowConfirmation(true); // Show the confirmation dialog
    setContactToDelete(contactId); // Set the ID of the contact to be deleted
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${contactToDelete}`);
      setContacts(contacts.filter((contact) => contact._id !== contactToDelete));
      setShowConfirmation(false); // Hide the confirmation dialog after successful deletion
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

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
          placeholder="Search by Error Type"
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
                    className="email-link"
                    onClick={() => navigate(`/alluser?email=${contact.email}`)}
                  >
                    Email: {contact.email}
                  </p>
                  <p>Error Type: {contact.errorType}</p>
                  <p>Specific Error: {contact.specificError}</p>
                  <p>Message: {contact.message}</p>
                  <p>Created At: {new Date(contact.createdAt).toLocaleDateString()}</p>
                </div>
                <FaTrash
                  className="delete-iconx"
                  onClick={() => handleDeleteConfirmation(contact._id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-contacts">No contacts found.</p>
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
        message="Are you sure you want to delete this contact?"
      />
    </>
  );
};

export default Allticket;
