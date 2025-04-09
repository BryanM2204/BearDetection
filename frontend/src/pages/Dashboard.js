import React, { useEffect, useState } from "react";
import placeholder from '../images/placeholder.jpg'

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [detections, setDetections] = useState([]);
  // comments
  // useEffect(() => {
  //   //fetch("/api/detections")
  //   fetch("/api/dashboard")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setMessage(data.message);
  //       setDetections(data.detections);
  //     })
  //     .catch((err) => console.error("Error fetching dashboard data:", err));
  // }, []);
  
  const placeholderDetections = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    label: "Bear",
    timestamp: `April ${10 - index}, 2025 - ${1 + index}:00 AM`,
    image: placeholder
  }));

  return (
    <div style={{ backgroundColor: "#191919", minHeight: "100vh", color: "white" }}>
      <div className="container mt-5">
        <h2 style={{ color: "#ffd400", padding: "20px"}} className="text-center">Dashboard</h2>
          <div className="container">
          {placeholderDetections.map((detection) => (
            <div
              key={detection.id}
              className="mb-5 p-4 rounded"
              style={{ backgroundColor: "#323232", boxShadow: "0 0 15px rgba(0,0,0,0.4)" }}
            >
              <img
                src={detection.image}
                alt={`Detection ${detection.id}`}
                className="img-fluid rounded mb-3"
                style={{ width: "100%", maxHeight: "350px", objectFit: "scale-down" }}
              />
              <h4 style={{ color: "#ffd400" }}>{detection.label}</h4>
              <p className="text-white-50" style={{ fontSize: "0.9rem" }}>{detection.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

