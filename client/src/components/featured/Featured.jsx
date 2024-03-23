import React from 'react';
import { faCar, faMapMarkerAlt, faCreditCard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./featured.css";

const Stepper = () => {
  return (
    <div className="tutorialContainer">
    <h1 className="tutorialTitle">How to Use Our Parking App</h1>
    <ol className="tutorialSteps">
      <li className="tutorialStep">
        <FontAwesomeIcon icon={faCar} className="tutorialStepIcon" />
        <h2>Select Your Vehicle</h2>
        <p>Open the app and choose the type of vehicle you're driving.</p>
      </li>
      <li className="tutorialStep">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="tutorialStepIcon" />
        <h2>Choose Your Parking Spot</h2>
        <p>Browse through available parking spots and select one that suits your needs.</p>
      </li>
      <li className="tutorialStep">
        <FontAwesomeIcon icon={faCreditCard} className="tutorialStepIcon" />
        <h2>Pay Securely Online</h2>
        <p>Enter your payment details and confirm your reservation to lock in the rate.</p>
      </li>
      <li className="tutorialStep">
        <FontAwesomeIcon icon={faCheckCircle} className="tutorialStepIcon" />
        <h2>Confirm Your Reservation</h2>
        <p>Receive a confirmation message and enjoy your reserved parking spot.</p>
      </li>
    </ol>
    
  </div>  
  );
};

export default Stepper;
