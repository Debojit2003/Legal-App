import React from "react";
import "./LawyerPage.css";
import email from "../assets/images/email.png";
import chatbot from "../assets/images/chatbot.png";
import casest from "../assets/images/file.png";
import home from "../assets/images/home.png";
import user from "../assets/images/user.png";
import about from "../assets/images/about.png";
import setting from "../assets/images/settings.png";

const LawyerPage = () => {
  return (
    <div className="lawyer-container">
      <header className="lawyer-header">
        <h1 className="title">TrialTech</h1>
        <div className="header-icons">
          <span className="menu-icon">☰</span>
          <span className="language-icon">🌍</span>
        </div>
      </header>

      <div className="content-section">
        <div className="card pending-appointments">
          <img src={email} alt="Pending Appointments" />
          <span className="badge">1</span>
          <p>Pending Appointments</p>
        </div>

        <div className="card current-case-status">
          <img src={casest} alt="Current Case Status" />
          <p>Current case status</p>
        </div>

        <div className="card chatbot">
          <img src={chatbot} alt="Chatbot" />
          <p>Chatbot</p>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item">
          <img src={home} alt="Home" />
          <p>Home</p>
          <span className="badge">1</span>
        </div>
        <div className="nav-item">
          <img src={user} alt="Profile" />
          <p>Profile</p>
        </div>
        <div className="nav-item">
          <img src={about} alt="About" />
          <p>About</p>
        </div>
        <div className="nav-item">
          <img src={setting} alt="Settings" />
          <p>Settings</p>
        </div>
      </nav>
    </div>
  );
};

export default LawyerPage;
