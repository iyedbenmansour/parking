import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Planbox from "../../components/planbox/Planbox";
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';



export default function Empty() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState({
    ecop: 0,
    luxp: 0,
    hadp: 0,
    sfaxcaplux: 0,
    sfaxcapeco: 0,
    sfaxcaphad: 0,
    djcaplux: 0,
    djcapeco: 0,
    djcaphad: 0
  });
  const [bookingDates, setBookingDates] = useState(null);
  const [bookingCarModel, setBookingCarModel] = useState(null); // State to store the booking car model

  
  useEffect(() => {
    // Fetch parking zone prices and capacities from API
    const fetchVariables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/variables');
        const {
          ecop,
          luxp,
          hadp,
          sfaxcaplux,
          sfaxcapeco,
          sfaxcaphad,
          djcaplux,
          djcapeco,
          djcaphad
        } = response.data;
        setPrices({
          ecop,
          luxp,
          hadp,
          sfaxcaplux,
          sfaxcapeco,
          sfaxcaphad,
          djcaplux,
          djcapeco,
          djcaphad
        });
      } catch (error) {
        console.error('Error fetching variables:', error);
      }
    };

    fetchVariables();
  }, []); // Empty dependency array to run once on component mount

  // Retrieve start and end datetime strings from sessionStorage
 const storedStart = sessionStorage.getItem("start");
 const storedEnd = sessionStorage.getItem("end");
 const pos = sessionStorage.getItem("p"); // Define a function to handle the booking form submission
 let startTime, endTime; // Define these variables outside the if block

 
 if (storedStart && storedEnd) {
    startTime = new Date(storedStart); // Parse the start datetime string into a Date object
    endTime = new Date(storedEnd); // Parse the end datetime string into a Date object
 }

 // Function to calculate price for each zone
 const calculatePrice = (start, end, multiplier) => {
  // Calculate price based on booking start, end dates, and price multiplier
  if (start && end) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInHours = (endTime - startTime) / (1000 * 60 * 60);
    return diffInHours * multiplier;
  }
  return 0; // Return 0 if start or end date is missing
};


const { ecop, luxp, hadp, sfaxcaplux, sfaxcapeco, sfaxcaphad, djcaplux, djcapeco, djcaphad } = prices;
const { bookingStartDate, bookingEndDate } = bookingDates || {};

const ecoPrice = calculatePrice(startTime, endTime, ecop);
const luxPrice = calculatePrice(startTime, endTime, luxp);
const handPrice = calculatePrice(startTime, endTime, hadp);

// Determine which capacities to display based on the booking car model
const displayEcoCapacity = pos === "Sfax–Thyna International Airport"? sfaxcapeco : djcapeco;
const displayLuxCapacity = pos === "Sfax–Thyna International Airport"? sfaxcaplux : djcaplux;
const displayHandCapacity = pos === "Sfax–Thyna International Airport"? sfaxcaphad : djcaphad;

 
return (
  <>
    <Navbar />
    <div className="mainContentArea">
      
      <Planbox
        title="Economy Zone"
        description="This zone could be designed for vehicles that require less space, such as compact cars or motorcycles. It's a great option for those who don't need a lot of parking space."
        price={ecoPrice} // Format price to fixed decimals
        capacity={displayEcoCapacity} // Display capacity based on the booking car model
      />
      <Planbox
        title="Premium Zone"
        description="Ideal for luxury vehicles or those that require more space, such as SUVs or large sedans. This zone offers more spacious parking spaces and might include additional amenities like reserved parking spots or valet services."
        price={luxPrice} // Format price to fixed decimals
        capacity={displayLuxCapacity} // Display capacity based on the booking car model
      />
      <Planbox
        title="Handicap Zone"
        description="This zone is designed to accommodate vehicles with handicap parking permits. It ensures that individuals with disabilities have easy access to parking spaces."
        price={handPrice} // Format price to fixed decimals
        capacity={displayHandCapacity} // Display capacity based on the booking car model
      />
    </div>
    <Footer />
  </>
);
}