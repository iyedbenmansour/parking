import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import PlanBox from "../../components/planbox/Planbox";

export default function Empty() {


 // Retrieve start and end dates from sessionStorage
 const storedStartDate = sessionStorage.getItem("startDate");
 const storedEndDate = sessionStorage.getItem("endDate");
 let startTime, endTime; // Define these variables outside the if block

 if (storedStartDate && storedEndDate) {
    startTime = new Date(storedStartDate); // Parse the date string into a Date object
    endTime = new Date(storedEndDate); // Parse the date string into a Date object
 }

 // Function to calculate price for each zone
 const calculatePrice = (start, end, multiplier) => {
    const diffInHours = (end - start) / (1000 * 60 * 60);
    return diffInHours * multiplier;
 };

 // Calculate prices for each zone
 const ecoPrice = calculatePrice(startTime, endTime, 1.1); // Multiplier for Economy Zone
 const luxPrice = calculatePrice(startTime, endTime, 2.2); // Multiplier for Luxury Zone
 const handPrice = calculatePrice(startTime, endTime, 0.6); // Multiplier for Handicap Zone

 return (
    <>
      <Navbar />
      <div className="mainContentArea">
        <PlanBox
          title="Economy Zone"
          description="This zone could be designed for vehicles that require less space, such as compact cars or motorcycles. It's a great option for those who don't need a lot of parking space."
          price={ecoPrice}
        />
        <PlanBox
          title="Premium Zone"
          description="Ideal for luxury vehicles or those that require more space, such as SUVs or large sedans. This zone offers more spacious parking spaces and might include additional amenities like reserved parking spots or valet services."
          price={luxPrice}
        />
        <PlanBox
          title="Handicap Zone"
          description="This zone is designed to accommodate vehicles with handicap parking permits. It ensures that individuals with disabilities have easy access to parking spaces."
          price={handPrice}
        />
      </div>
      <Footer />
    </>
 );
}
