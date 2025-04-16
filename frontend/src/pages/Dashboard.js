import React, { useEffect, useState } from "react";
import placeholder from '../resources/placeholder.jpg';
import './Dashboard.css';
import { BiRefresh } from "react-icons/bi";

const Card = (props) => {
  return (
    <div className={props.type === "bulk" ? "img-card" : "last-img"}>
      <img
        src={props.imgURL || placeholder}
        alt="detection"
        style={{ cursor: 'pointer' }}
        onClick={() => window.open(props.imgURL || placeholder, '_blank')}
      />
      <div className="text">
        <span>{props.animal}</span>
        <span>{props.info}</span>
      </div>
    </div>
  )
}

const CardDisplay = ({ data }) => {
  return (
    <div className="cards">
      {data.map((card, index) => (
        <Card
          key={index}
          animal={card.animal}
          info={card.info}
          type={card.type}
          imgURL = {card.imgURL}
        />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [cardData, setCardData] = useState([]);
  // const cardData = [
  //   { animal: "Bear", info: "April 15, 2025 - 1:45 AM", type: "bulk" },
  //   { animal: "Bear", info: "April 15, 2025 - 1:45 AM", type: "bulk" },
  //   { animal: "Cat", info: "April 11, 2025 - 6:49 PM", type: "bulk" },
  //   { animal: "Bear", info: "April 15, 2025 - 1:45 AM", type: "bulk" },
  //   { animal: "Bear", info: "April 15, 2025 - 1:45 AM", type: "bulk" },
  //   { animal: "Bear", info: "April 15, 2025 - 1:45 AM", type: "bulk" },
  //   { animal: "Cat", info: "April 11, 2025 - 6:49 PM", type: "bulk" },
  //   { animal: "Bear", info: "April 15, 2025 - 1:45 AM", type: "bulk" },
  //   { animal: "Cat", info: "April 11, 2025 - 6:49 PM", type: "bulk" },
  //   { animal: "Bear", info: "April 15, 2025 - 1:45 AM", type: "bulk" },
  // ];

  const refreshApp = async () => 
  {
    const response = await fetch("IP/geturls"); 
    const imagePaths = await response.json(); 

    const updatedData = imagePaths.map(path => {
        const fullUrl = `IP/geturls${path}`;
        const animal = "bear"
        const dateStr = "April 13, 2025 - 2:13 AM"

        return {
          animal: animal,
          info: dateStr,
          type: "bulk",
          imgUrl: fullUrl
        };
      });

    setCardData(updatedData);
  };

  return (
    <div className="dash-content">
      <div className="page-name">
        <span>Dashboard</span>
      </div>
      <div className='refresh-button'>
        <button onClick = {refreshApp}>
          <BiRefresh />
        </button>
      </div>
      <div className="notifications">
        <div className="latest-card">
          <img src={placeholder} alt="latest detection" style={{ cursor: 'pointer' }} onClick={() => window.open(placeholder, '_blank')} />
        </div>
        <div className="update-text">
          <div className="update-title">Latest Updates</div>
          <div className="update-entry">• Bear detected at 9:34 PM - April 1, 2025</div>
          <div className="update-entry">• Bear detected at 7:22 PM - March 31, 2025</div>
          <div className="update-entry">• Cat detected at 12:41 PM - March 29, 2025</div>
        </div>
      </div>
      <CardDisplay data={cardData} />
    </div>
  );
};

export default Dashboard;