import React, { useEffect, useState } from "react";
import placeholder from '../resources/placeholder.jpg';
import './Dashboard.css';

const Dashboard = () => {

  const Card = (props) => {

    return (
      <div className={props.type === "bulk" ? "img-card" : "last-img"}>
        <img src="static/Cat-detection2025-04-09_10-28-49.756937.png" alt="placeholder"></img>
        <div className="text">
          <span>{props.animal}</span>
          <span>{props.info}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-content">
      <div className="page-name">
        <span>Dashboard</span>
      </div>
      <div>
        <Card animal="Last Image" info="April 15, 2025 4:56 PM" type="primary"></Card>
      </div>
      <div className="cards">
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM" type="bulk"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM" type="bulk"></Card>
        <Card animal="Cat" info="April 11, 2025 - 6:49 PM" type="bulk"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM" type="bulk"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM" type="bulk"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM" type="bulk"></Card>
        <Card animal="Cat" info="April 11, 2025 - 6:49 PM" type="bulk"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM" type="bulk"></Card>
      </div>
    </div>
  );
};

export default Dashboard;

