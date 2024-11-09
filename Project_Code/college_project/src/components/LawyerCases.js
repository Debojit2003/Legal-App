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
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./LawyerCases.css"; // Import the CSS file

const LawyerCases = () => {
  const [caseDetails, setCaseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchLawyerData = async () => {
      const user = auth.currentUser;
      if (user) {
        const lawyerDoc = await getDoc(doc(db, "lawyers", user.uid));
        if (lawyerDoc.exists()) {
          const lawyerData = lawyerDoc.data();
          const caseIds = [...lawyerData.present_case, ...lawyerData.past_case];

          if (caseIds.length > 0) {
            await fetchCaseDetails(caseIds);
          } else {
            setLoading(false); // No cases, set loading to false
          }
        }
      }
    };

    fetchLawyerData();
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

  if (loading) {
    return <div>Loading case details...</div>;
  }
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div className="case-container">
      {/* Top bar with Home button */}
      <div className="top-bar">
        <button
          className="home-button"
          onClick={() => handleNavigation("/lawyer")}>
          Home
        </button>
      </div>

      <h3>Case Details:</h3>
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

export default LawyerCases;
