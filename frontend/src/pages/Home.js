import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [features] = useState([
    {
      id: 1,
      title: "Advanced Detection Technology",
      description: "Powered by the YOLO object detection model for real-time bear identification with high accuracy.",
      icon: "📷"
    },
    {
      id: 2,
      title: "Non-harmful Deterrence Solutions",
      description: "Humanely deters bears using strategically timed blaring noises and high-intensity light flashing.",
      icon: "🐻"
    }
  ]);

  // Check login status (placeholder for actual auth logic)
  useEffect(() => {
    // This would normally check a token in localStorage or similar
    const checkLoginStatus = () => {
      const token = localStorage.getItem("userToken");
      setIsLoggedIn(!!token);
    };
    
    checkLoginStatus();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to BearGuard!</h1>
          <p className="lead">Protecting communities through innovative bear detection and deterrence</p>
          <div>
            {isLoggedIn ? (
              <button className="button primary-btn" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </button>
            ) : (
              <>
                <button className="button primary-btn" onClick={() => navigate("/login")}>
                  Log In
                </button>
                <button className="button primary-btn" onClick={() => navigate("/signup")}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.id}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="DashPrev-section">
        <h2>Dashboard Preview</h2>
        <div>
          {isLoggedIn ? (
            <button className="button primary-btn" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <p>You must sign in first!</p>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>2024-25 UCONN CSE Group</p>
      </footer>
    </div>
  );
};

export default Home;