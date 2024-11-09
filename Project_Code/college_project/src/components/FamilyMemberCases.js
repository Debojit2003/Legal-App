import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./LawyerCases.css"; // Import the CSS file

const FamilyMemberCases = () => {
  const [caseDetails, setCaseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchFamilyMemberData = async () => {
      const user = auth.currentUser;
      if (user) {
        const familyMemberDoc = await getDoc(
          doc(db, "family_member", user.uid)
        );
        if (familyMemberDoc.exists()) {
          const familyMemberData = familyMemberDoc.data();
          const caseIds = familyMemberData.case_st_id || [];

          if (caseIds.length > 0) {
            await fetchCaseDetails(caseIds);
          } else {
            setLoading(false); // No cases, set loading to false
          }
        }
      }
    };

    fetchFamilyMemberData();
  }, [auth, db]);

  const fetchCaseDetails = async (caseIds) => {
    const casesQuery = query(
      collection(db, "cases"),
      where("case_id", "in", caseIds)
    );
    const querySnapshot = await getDocs(casesQuery);

    const fetchedCaseDetails = querySnapshot.docs.map((doc) => doc.data());
    setCaseDetails(fetchedCaseDetails);
    setLoading(false); // Done loading data
  };

  const handleHomeClick = () => {
    navigate("/"); // Navigate to the home page
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div>Loading case details...</div>;
  }

  return (
    <div className="case-container">
      {/* Top bar with Home button */}
      <div className="top-bar">
        <button
          className="home-button"
          onClick={() => handleNavigation("/family-member")}
        >
          Home
        </button>
      </div>

      <h3>Family Member Case Details:</h3>
      {caseDetails.length > 0 ? (
        <div className="case-cards">
          {caseDetails.map((caseData, index) => (
            <div key={index} className="case-card">
              <p>
                <strong>Case ID:</strong> {caseData.case_id}
              </p>
              <p>
                <strong>Case Detail:</strong> {caseData.case_detail}
              </p>
              <p>
                <strong>Case Type:</strong> {caseData.case_type}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No case details available</p>
      )}
    </div>
  );
};

export default FamilyMemberCases;
