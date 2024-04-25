import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [dateTime, setDateTime] = useState({
    startDate: new Date(),
    endDate: new Date(),
    startTime: "00:00",
    endTime: "00:00",
  });

  const navigate = useNavigate();

  const handleSearch = () => {
    const start = `${format(dateTime.startDate, "MM/dd/yyyy")} ${
      dateTime.startTime
    }`;
    const end = `${format(dateTime.endDate, "MM/dd/yyyy")} ${dateTime.endTime}`;

    // Save to session storage
    sessionStorage.setItem("start", start);
    sessionStorage.setItem("end", end);

    navigate("/empty", { state: { destination, start, end } });
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faCar} />
            <span>Parking</span>
          </div>
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
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="headerIcon" />
                <select
                  className="headerSearchSelect"
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">Select an airport ..</option>
                  <option value="location1">
                    {" "}
                    Sfax–Thyna International Airport
                  </option>
                  <option value="location2">
                    Djerba Zarzis International Airport
                  </option>
                </select>
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >{`${format(dateTime.startDate, "MM/dd/yyyy")} to ${format(
                  dateTime.endDate,
                  "MM/dd/yyyy"
                )}`}</span>
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) =>
                      setDateTime({ ...dateTime, ...item.selection })
                    }
                    moveRangeOnFirstSelection={false}
                    ranges={[
                      {
                        startDate: dateTime.startDate,
                        endDate: dateTime.endDate,
                        key: "selection",
                      },
                    ]}
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <input
                  type="time"
                  value={dateTime.startTime}
                  onChange={(e) =>
                    setDateTime({ ...dateTime, startTime: e.target.value })
                  }
                  className="headerSearchTime"
                />
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <input
                  type="time"
                  value={dateTime.endTime}
                  onChange={(e) =>
                    setDateTime({ ...dateTime, endTime: e.target.value })
                  }
                  className="headerSearchTime"
                />
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
