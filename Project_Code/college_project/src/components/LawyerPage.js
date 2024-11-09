import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LawyerPage.css";
import email from "../assets/images/email.png";
import chatbot from "../assets/images/chatbot.png";
import casest from "../assets/images/file.png";
import home from "../assets/images/home.png";
import user from "../assets/images/user.png";
import about from "../assets/images/about.png";
import setting from "../assets/images/settings.png";
import LanguageSelector from "./LanguageSelector";

const LawyerPage = () => {
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="lawyer-container">
      <header className="lawyer-header">
        <h1 className="title">TrialTech</h1>
        <div className="header-icons">
          <span className="menu-icon">☰</span>
          <span className="language-icon">
            <LanguageSelector />
          </span>
        </div>
      </header>

      <div className="content-section">
        <div className="card pending-appointments">
          <img src={email} alt="Pending Appointments" />
          <p>Pending Appointments</p>
        </div>

        <div
          className="card current-case-status"
          onClick={() => handleNavigation("/lawyer-cases")} // Navigates to the LawyerCases page
        >
          <img src={casest} alt="Current Case Status" />
          <p>Current case status</p>
        </div>

        <div className="card chatbot">
          <img src={chatbot} alt="Chatbot" />
          <p>Chatbot</p>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => handleNavigation("/lawyer")}>
          <img src={home} alt="Home" />
          <p>Home</p>
        </div>
        <div className="nav-item" onClick={() => handleNavigation("/profile")}>
          <img src={user} alt="Profile" />
          <p>Profile</p>
        </div>
        <div className="nav-item" onClick={() => handleNavigation("/about")}>
          <img src={about} alt="About" />
          <p>About</p>
        </div>
        <div className="nav-item" onClick={toggleSettings}>
          <img src={setting} alt="Settings" />
          <p>Settings</p>
          {showSettings && (
            <div className="settings-dropdown">
              <p>Edit Profile</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default LawyerPage;
