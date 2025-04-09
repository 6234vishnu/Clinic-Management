import React from 'react';
import { NavLink } from 'react-router-dom';
import "../../../assets/css/partials/doctorNav.css"; // your CSS path

function DoctornavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <img src="" alt="Logo" className="navbar-logo" />

        <div className="navbar-links">
          <a href="#home" className="navbar-link">Home</a>
          <a href="#about" className="navbar-link">About</a>
          <a href="#services" className="navbar-link">Services</a>
          <a href="#contact" className="navbar-link">Contact</a>
        </div>
      </div>
    </nav>
  );
  
}

export default DoctornavBar;
