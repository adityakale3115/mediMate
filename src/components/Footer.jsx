import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>MediMate.Ai</h3>
          <p>Your AI companion for healthcare support.</p>
        </div>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/symptoms">Symptom Checker</a>
          <a href="/appointments">Appointments</a>
          <a href="/uploads">Uploads</a>
        </div>
        <div className="footer-contact">
          <p>Contact: support@medimate.ai</p>
          <p>&copy; {new Date().getFullYear()} MediMate.Ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
