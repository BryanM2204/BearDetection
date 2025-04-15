import React from "react";
import './About.css';

const About = () => {
  return (
    <div className = "about-container">
      {/* About Section */}
      <section className="hero-section">
        <h1>About BearGuard</h1>
        <p className="lead">
        BearGuard was developed to address the growing challenge of human-bear conflicts in communities like Simsbury, Connecticut. Our mission is to create innovative solutions that protect both people and bears through ethical, non-invasive technology.
        </p>
      </section>
      
      {/* Team Section */}
      <section className="team-section">
        <h2>Meet our Team!</h2>
      </section>
    </div>
  )
};

export default About;