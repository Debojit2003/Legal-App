import React from "react";
import "./JailAuthorityPage.css";
import dashboard from "../assets/images/dashboard.png";
import chatbot from "../assets/images/chatbot.png";
import bail from "../assets/images/bail.png";
import home from "../assets/images/home.png";
import user from "../assets/images/user.png";
import about from "../assets/images/about.png";
import setting from "../assets/images/settings.png";
import globe from "../assets/images/languages.png";
const JailAuthorityPage = () => {
  return (
    <div className="jail-container">
      <header className="jail-header">
        <h1 className="title">TrialTech</h1>
        <div className="header-icons">
          <span className="menu-icon">☰</span>
          <span className="language-icon">
            <img
              src={globe}
              alt="Language"
              style={{ width: '30px', height: '30px' }}
           />        
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
          <span className="badge">1</span>
          <p>Bail Consideration Application</p>
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

export default JailAuthorityPage;
