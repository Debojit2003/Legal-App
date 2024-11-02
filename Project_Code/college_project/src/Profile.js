import React, { useEffect, useState } from 'react';
//import "./Auth.css";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import "./JailAuthorityPage.css";
import home from "../assets/images/home.png";
import user from "../assets/images/user.png";
import about from "../assets/images/about.png";
import setting from "../assets/images/settings.png";
import globe from "../assets/images/languages.png";
const ProfilePage = () => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [auth, db]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  const goHome = (userRole) => {
    switch (userRole) {
      case 'Family-Member':
        navigate('/family-member');
        break;
      case 'Lawyer':
        navigate('/lawyer');
        break;
      case 'Jail-Authority':
        navigate('/jail-authority');
        break;
      default:
        alert('Unknown role');
    }
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
            <img
              src={globe}
              alt="Language"
              style={{ width: "30px", height: "30px" }}
            />
          </span>
        </div>
      </header>

      <div className="content-section">
        <div className="card">
            <h1>Profile</h1>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
        </div>
      </div>

      <nav className="bottom-nav">
        <div
          className="nav-item"
          onClick={() => goHome(userData.role)}
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

export default ProfilePage;
