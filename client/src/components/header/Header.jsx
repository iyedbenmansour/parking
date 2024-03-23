import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  faCalendarDays,
  faCar,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);


  const navigate = useNavigate();

 
  const handleSearch = () => {
    navigate("/empty", { state: { destination, date } });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          {/* Update the list items to reflect parking services */}
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faCar} />
            <span>Parking</span>
          </div>
          {/* Add other parking-related services as needed */}
        </div>
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              Parking Made Easy: A Lifetime of Savings, Just One Click Away!
            </h1>
            <p className="headerDesc">
              Maximize Your Savings – Discover Instant Parking Discounts Up to
              10%!
            </p>
            <button className="headerBtn" onClick={handleRegisterClick}>Sign in / Register</button>
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="headerIcon" />
                <select
                  className="headerSearchSelect"
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">Select an airport ..</option>
                  <option value="location1"> Sfax–Thyna International Airport</option>
                  <option value="location2">Djerba Zarzis International Airport</option>
                </select>
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >{`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
                  date[0].endDate,
                  "MM/dd/yyyy"
                )}`}</span>
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDate([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </div>
           
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
