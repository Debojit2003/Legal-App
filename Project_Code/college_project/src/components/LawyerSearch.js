import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LawyerSearch.css";
import { getFirestore, doc, getDoc, query, where, collection, getDocs, setDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import home from "../assets/images/home.png";
import user from "../assets/images/user.png";
import about from "../assets/images/about.png";
import setting from "../assets/images/settings.png";
import globe from "../assets/images/languages.png";

const LawyerSearch = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [lawyers, setLawyers] = useState([]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSettingsPopup = () => {
    setShowSettingsPopup(!showSettingsPopup);
  };

  const requestLawyer = async (Id) => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const lawyerRef = doc(db, 'lawyers', Id);
      const userRef = doc(db, 'family_member', userId);

      await setDoc(lawyerRef, {
        requested_cases: arrayUnion(userId)
      }, { merge: true });

      await setDoc(userRef, {
        requested: arrayUnion(Id)
      }, { merge: true });

    } catch (error) {
      console.error("Error requesting lawyer:", error);
    }
  };

  const fetchLawyers = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (!userData) throw new Error('User data not found.');

      const familyMemberRef = doc(db, 'family_member', userId);
      const familyMemberDoc = await getDoc(familyMemberRef);
      const familyMemberData = familyMemberDoc.data();

      if (!familyMemberData || !familyMemberData.case_st_id || familyMemberData.case_st_id.length === 0) {
        throw new Error('User has no associated cases.');
      }

      const requested = familyMemberData.requested;
      const caseId = familyMemberData.case_st_id[0];
      const caseRef = doc(db, 'cases', caseId);
      const caseDoc = await getDoc(caseRef);
      const caseData = caseDoc.data();

      if (!caseData || !caseData.case_type) throw new Error('Case details are missing or incomplete.');

      const caseType = caseData.case_type;
      const lawyersQuery = query(collection(db, 'lawyers'), where('type', '==', caseType));
      const lawyersSnapshot = await getDocs(lawyersQuery);
      var lawyersList = lawyersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (requested !== undefined) {
        lawyersList = lawyersList.filter(lawyer => !requested.includes(lawyer.id));
      }

      setLawyers(lawyersList);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) fetchLawyers(user.uid);
  }, [auth]);

  return (
    <div className="app-container">
      <header className="header-container">
        <h1 className="header-title">TrialTech</h1>
        <div className="header-icons">
          <span className="menu-icon">☰</span>
          <img src={globe} alt="Language" className="language-icon" />
        </div>
      </header>

      <div className="content-container">
        <button onClick={() => auth.currentUser && fetchLawyers(auth.currentUser.uid)} className="refresh-button">
          Refresh Lawyers
        </button>
        <div className="lawyer-list">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="lawyer-card">
              <h3>{lawyer.name}</h3>
              <p>Email: {lawyer.email}</p>
              <p>Phone: {lawyer.phno}</p>
              <p>Address: {lawyer.address}</p>
              <p>Type: {lawyer.type}</p>
              <p>Court Area: {lawyer.court_area}</p>
              <button onClick={() => requestLawyer(lawyer.id)} className="request-button">
                Request Lawyer
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer-nav-container">
        <div className="nav-item" onClick={() => handleNavigation("/family-member")}>
          <img src={home} alt="Home" />
          <p>Home</p>
        </div>
        <div className="nav-item" onClick={() => handleNavigation("/profile")}>
          <img src={user} alt="Profile" />
          <p>Profile</p>
        </div>
        <div className="nav-item" onClick={() => handleNavigation("/about-family")}>
          <img src={about} alt="About" />
          <p>About</p>
        </div>
        <div className="nav-item" onClick={toggleSettingsPopup}>
          <img src={setting} alt="Settings" />
          <p>Settings</p>
          {showSettingsPopup && (
            <div className="settings-popup">
              <p onClick={() => handleNavigation("/edit-profile")}>Edit Profile</p>
              <p onClick={() => handleNavigation("/")}>Logout</p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default LawyerSearch;
