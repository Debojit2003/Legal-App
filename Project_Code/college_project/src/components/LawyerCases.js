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
          const presentCaseIds = lawyerData.present_case || [];
          const pastCaseIds = lawyerData.past_case || [];

          // Log to check if present_case and past_case arrays are correct
          console.log("Present Case IDs:", presentCaseIds);
          console.log("Past Case IDs:", pastCaseIds);

          // Get family members associated with this lawyer
          const familyMemberQuery = query(
            collection(db, "family_member"),
            where("lawyer_id", "array-contains", user.uid) // Ensure the lawyer is associated with the family member
          );
          const familyMembersSnapshot = await getDocs(familyMemberQuery);
          const familyMemberCaseIds = [];
          familyMembersSnapshot.forEach((doc) => {
            const familyMemberData = doc.data();
            if (familyMemberData.case_st_id) {
              familyMemberCaseIds.push(...familyMemberData.case_st_id);
            }
          });

          // Log family member case IDs
          console.log("Family Member Case IDs:", familyMemberCaseIds);

          // Combine case IDs from present_case, past_case, and family_member's case_st_id
          const allCaseIds = [
            ...presentCaseIds,
            ...pastCaseIds,
            ...familyMemberCaseIds,
          ];

          console.log("Combined Case IDs:", allCaseIds); // Log combined case IDs

          if (allCaseIds.length > 0) {
            // Fetch case details for the combined case IDs
            await fetchCaseDetails(allCaseIds);
          } else {
            setLoading(false); // No cases, set loading to false
          }
        }
      }
    };

    fetchLawyerData();
  }, [auth, db]);

  const fetchCaseDetails = async (allCaseIds) => {
    const casesQuery = query(
      collection(db, "cases"),
      where("case_id", "in", allCaseIds)
    );

    try {
      const querySnapshot = await getDocs(casesQuery);

      // Check if any cases were found
      if (!querySnapshot.empty) {
        const fetchedCaseDetails = querySnapshot.docs.map((doc) => doc.data());
        console.log("Fetched Case Details:", fetchedCaseDetails); // Log case details to ensure data is fetched
        setCaseDetails(fetchedCaseDetails);
      } else {
        console.log("No cases found with these IDs.");
        setCaseDetails([]); // Set empty array if no cases are found
      }
      setLoading(false); // Done loading data
    } catch (error) {
      console.error("Error fetching case details:", error);
      setLoading(false);
    }
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
          onClick={() => handleNavigation("/lawyer")}
        >
          Home
        </button>
        <h3>Case Details:</h3>
      </div>

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

