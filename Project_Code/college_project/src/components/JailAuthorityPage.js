import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JailAuthorityPage.css";
import dashboard from "../assets/images/dashboard.png";
import chatbot from "../assets/images/chatbot.png";
import bail from "../assets/images/bail.png";
import home from "../assets/images/home.png";
import user from "../assets/images/user.png";
import about from "../assets/images/about.png";
import setting from "../assets/images/settings.png";
import LanguageSelector from "./LanguageSelector";
const JailAuthorityPage = () => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSettingsPopup = () => {
    setShowSettingsPopup(!showSettingsPopup);
  };
  return (
    <div className="jail-container">
      <header className="jail-header">
        <h1 className="title">TrialTech</h1>
        <div className="header-icons">
          <span className="menu-icon">☰</span>
          <span className="language-icon">
            <LanguageSelector />
          </span>
        </div>
      </header>

      <div className="content-section">
        <div className="card dashboard">
          <img src={dashboard} alt="Dashboard" />
          <p>Dashboard</p>
        </div>

        <div className="card bail-consideration">
          <img src={bail} alt="Bail Consideration" />

          <p>Bail Consideration Application</p>
        </div>

        <div className="card chatbot">
          <img src={chatbot} alt="Chatbot" />
          <p>Chatbot</p>
        </div>
      </div>

      <nav className="bottom-nav">
        <div
          className="nav-item"
          onClick={() => handleNavigation("/jail-authority")}
        >
          <img src={home} alt="Home" />
          <p>Home</p>
        </div>
        <div 
          className="nav-item"
          onClick={() => handleNavigation("/profile")}
        >
          <img src={user} alt="Profile" />
          <p>Profile</p>
        </div>
        <div
          className="nav-item"
          onClick={() => handleNavigation("/aboutjail")}
        >
          <img src={about} alt="About" />
          <p>About</p>
        </div>
        <div className="nav-item" onClick={toggleSettingsPopup}>
          <img src={setting} alt="Settings" />
          <p>Settings</p>
          {showSettingsPopup && (
            <div className="settings-dropdown">
              <p onClick={() => handleNavigation("/edit-profile")}>
                Edit Profile
              </p>
              <p onClick={() => handleNavigation("/")}>Logout</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default JailAuthorityPage;
