import React, { useEffect, useState } from "react";
import placeholder from '../resources/placeholder.jpg';
import './Dashboard.css';

const Dashboard = () => {

  const Card = (props) => {

    return (
      <div className="card">
        <img src={placeholder} alt="placeholder"></img>
        <div className="text">
          <span>{props.animal}</span>
          <span>{props.info}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="content">
      <div className="title">
        <span>Dashboard</span>
      </div>
      <div className="cards">
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM"></Card>
        <Card animal="Cat" info="April 11, 2025 - 6:49 PM"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM"></Card>
      </div>
    </div>
  );
};

export default Dashboard;

