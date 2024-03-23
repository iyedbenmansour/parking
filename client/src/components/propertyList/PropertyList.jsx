import React from 'react';
import "./propertyList.css";

const PropertyList = () => {
  return (
    <div className="aboutUsSection">
      <h1 className="sectionTitle">About Our Parking Solutions</h1>
      <div className="aboutUsContent">
        <div className="aboutUsItem">
          <div className="aboutUsDetails">
            <h2>Short-Term Parking</h2>
            <p>We offer convenient short-term parking solutions in various locations, perfect for visitors and commuters.</p>
          </div>
        </div>
        <div className="aboutUsItem">
          <div className="aboutUsDetails">
            <h2>Long-Term Parking</h2>
            <p>Our long-term parking options provide secure storage for your vehicles, with easy access whenever you need it.</p>
          </div>
        </div>
      
        <div className="aboutUsItem">
          <div className="aboutUsDetails">
            <h2>Handicapped Parking</h2>
            <p>We ensure accessibility with designated parking spots for our valued customers with disabilities.</p>
          </div>
        </div>
        <div className="aboutUsItem">
          <div className="aboutUsDetails">
            <h2>Motorcycle Parking</h2>
            <p>For motorcycle enthusiasts, we have dedicated spaces where you can park your two-wheelers with pride.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
