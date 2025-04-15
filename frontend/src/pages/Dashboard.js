import React from "react";
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
      <div className="notifications">
        <div className="latest-card">
          <img src={placeholder} alt="latest detection" />
        </div>
        <div className="update-text">
          <div className="update-title">Latest Updates</div>
          <div className="update-entry">• Bear detected at 9:34 PM - April 1, 2025</div>
          <div className="update-entry">• Bear detected at 7:22 PM - March 31, 2025</div>
          <div className="update-entry">• Cat detected at 12:41 PM - March 29, 2025</div>
        </div>
      </div>
      <div className="cards">
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM"></Card>
        <Card animal="Cat" info="April 11, 2025 - 6:49 PM"></Card>
        <Card animal="Bear" info="April 15, 2025 - 1:45 AM"></Card>
        <Card animal="Dog" info="April 16, 2025 - 2:13 PM"></Card>
      </div>
    </div>
  );
};

export default Dashboard;

