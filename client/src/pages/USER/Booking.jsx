import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./global.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const Booking = () => {
 const navigate = useNavigate();

 const [carModel, setCarModel] = useState("");
 const [licensePlate, setLicensePlate] = useState("");
 const [bookingStartDate, setBookingStartDate] = useState("");
 const [bookingEndDate, setBookingEndDate] = useState("");

 // Function to handle booking
 const handlebooking = async (e) => {
    e.preventDefault();
    const newBooking = {
      carModel,
      licensePlate,
      bookingStartDate,
      bookingEndDate,
    };
    try {
      sessionStorage.setItem("booking", JSON.stringify(newBooking));
      console.log("Booking saved in session storage:", newBooking);
      window.location.href = "/category";
    } catch (err) {
      console.error(err);
    }
 };



 useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      sessionStorage.removeItem("token");
      navigate("/login");
    } else {
    }
 }, [navigate]);


 return (
    <>
      <div>
        <Navbar />
        <Header type="list" />
        <div className="mainContentArea">
          <form className="bookingForm" onSubmit={handlebooking}>
            <h2>Fill this form to book </h2>

            <label htmlFor="carModel">Where:</label>
            <select
              id="carModel"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
            >
              <option value="" disabled>Select Location</option>
              <option value="Sfax–Thyna International Airport">
                Sfax–Thyna International Airport
              </option>
              <option value="Djerba–Zarzis international Airport">
                Djerba–Zarzis international Airport 
              </option>
            </select>

            <label htmlFor="licensePlate">License Plate:</label>
            <input
              type="text"
              id="licensePlate"
              placeholder="Car number"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
            />

            <label htmlFor="bookingStartDate">Booking Start Date and Time:</label>
            <input
              type="datetime-local"
              id="bookingStartDate"
              value={bookingStartDate}
              onChange={(e) => setBookingStartDate(e.target.value)}
              required
            />

            <label htmlFor="bookingEndDate">Booking End Date and Time:</label>
            <input
              type="datetime-local"
              id="bookingEndDate"
              value={bookingEndDate}
              onChange={(e) => setBookingEndDate(e.target.value)}
              required
            />

            <button type="submit">Book Now!</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
 );
};

export default Booking;
