import React from "react";
import "./FamilyMemberPage.css";
import ngo from "../assets/images/ngo.png";
import legalservice from "../assets/images/legal-service.png";
import usercase from "../assets/images/file.png";
import chatbot from "../assets/images/chatbot.png";
import home from "../assets/images/home.png";
import user from "../assets/images/profile-user.png";
import about from "../assets/images/about.png";
import setting from "../assets/images/settings.png";
const FamilyMemberPage = () => {
  return (
    <div className="family-container">
      <header className="family-header">
        <h1 className="title">TrialTech</h1>
        <div className="header-icons">
          <span className="menu-icon">☰</span>
          <span className="language-icon">🌍</span>
        </div>
      </header>

      <div className="content-section">
        <div className="card legal-services">
          <img src={legalservice} alt="Legal Services" />
          <p>Legal Services</p>
        </div>

        <div className="card case-status">
          <img src={usercase} alt="Case Status" />
          <p>Case Status</p>
        </div>

        <div className="card rehab-centres">
          <img src={ngo} alt="Rehabilitation Centre/NGOs" />
          <p>Rehabilitation Centre/NGOs</p>
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

export default FamilyMemberPage;
