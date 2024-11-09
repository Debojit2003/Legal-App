import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FamilyMemberPage.css";
import { getFirestore, doc, getDoc,query, where, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import home from "../assets/images/home.png";
import user from "../assets/images/user.png";
import about from "../assets/images/about.png";
import setting from "../assets/images/settings.png";
import globe from "../assets/images/languages.png";

const LawyerSearch = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const navigate = useNavigate();

  console.log("Hello");

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSettingsPopup = () => {
    setShowSettingsPopup(!showSettingsPopup);
  };

  const [lawyers, setLawyers] = useState([]);

  const fetchLawyers = async (userId) => {
    console.log("in mainBOsy");
    try {
      console.log("Fetching lawyers for user:", userId);

      // Fetch user data from users collection
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (!userData) {
        throw new Error('User data not found.');
      }

      // Fetch additional user information from family_member collection
      const familyMemberRef = doc(db, 'family_member', userId);
      const familyMemberDoc = await getDoc(familyMemberRef);
      const familyMemberData = familyMemberDoc.data();

      if (!familyMemberData || !familyMemberData.case_st_id || familyMemberData.case_st_id.length === 0) {
        throw new Error('User has no associated cases.');
      }

      console.log("Fetched family data");

      // Fetch the case details
      const caseId = familyMemberData.case_st_id[0]; // Assuming the user has at least one case
      const caseRef = doc(db, 'cases', caseId);
      const caseDoc = await getDoc(caseRef);
      const caseData = caseDoc.data();

      if (!caseData || !caseData.case_type) {
        throw new Error('Case details are missing or incomplete.');
      }

      // Find lawyers based on the case type
      const caseType = caseData.case_type;
      const lawyersQuery = query(collection(db, 'lawyers'), where('type', '==', caseType));
      const lawyersSnapshot = await getDocs(lawyersQuery);
      const lawyers = lawyersSnapshot.docs.map(doc => doc.data());

      console.log(lawyers);

      setLawyers(lawyers);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
    }
  };

  useEffect(() => {
    // Fetch lawyers when the component mounts
    const user = auth.currentUser;
    const userId = user.uid;
    console.log(userId);
    

    // Get the current logged-in user
    auth.onAuthStateChanged((user) => {
      if (user) {
        //fetchLawyers(user.uid);
      } else {
        navigate("/login"); // Redirect to login if no user is logged in
      }
    });
  });

  return (
    <div className="family-container">
      <header className="family-header">
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

      <div>
        <button onClick={() => auth.currentUser && fetchLawyers(auth.currentUser.uid)}>
          Refresh Lawyers
        </button>
        {lawyers.map((lawyer) => (
          <div key={lawyer.id}>
            <h3>{lawyer.name}</h3>
            <p>Email: {lawyer.email}</p>
            <p>Phone: {lawyer.phno}</p>
            <p>Address: {lawyer.address}</p>
            <p>Type: {lawyer.type}</p>
            <p>Court Area: {lawyer.court_area}</p>
          </div>
        ))}
      </div>

      <nav className="bottom-nav">
        <div
          className="nav-item"
          onClick={() => handleNavigation("/family-member")}
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
          onClick={() => handleNavigation("/about-family")}
        >
          <img src={about} alt="About" />
          <p>About</p>
        </div>
        <div className="nav-item" onClick={toggleSettingsPopup}>
          <img src={setting} alt="Settings" />
          <p>Settings</p>
          {showSettingsPopup && (
            <div className="settings-popup">
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

export default LawyerSearch;
