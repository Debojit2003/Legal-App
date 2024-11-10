import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayRemove
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Auth import
import "./PendingCases.css";

const PendingCases = () => {
  const [requestedCases, setRequestedCases] = useState([]);
  const [caseDetails, setCaseDetails] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State for showing the popup
  const [caseAccepted, setCaseAccepted] = useState(false); // State to track case acceptance status
  const db = getFirestore();
  const navigate = useNavigate();

  // Fetch the current user (lawyer) ID from Firebase Authentication
  const auth = getAuth();
  const currentUser = auth.currentUser; // Get current user details

  useEffect(() => {
    const fetchRequestedCases = async () => {
      if (currentUser) {
        try {
          const lawyerDocRef = doc(db, "lawyers", currentUser.uid); // Get the lawyer document by UID
          const lawyerDocSnap = await getDoc(lawyerDocRef);

          if (lawyerDocSnap.exists()) {
            const lawyerData = lawyerDocSnap.data();
            const requestedCaseIds = lawyerData.requested_cases || [];

            // Fetch requested family member details
            const familyMemberCollection = collection(db, "family_member");
            const caseQuery = query(
              familyMemberCollection,
              where("id", "in", requestedCaseIds)
            );
            const caseQuerySnapshot = await getDocs(caseQuery);

            const cases = caseQuerySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setRequestedCases(cases);

            // Fetch case details based on case_st_id from family_member
            const allCaseIds = cases.flatMap((caseItem) => caseItem.case_st_id);
            if (allCaseIds.length > 0) {
              const casesCollection = collection(db, "cases");
              const casesQuery = query(
                casesCollection,
                where("case_id", "in", allCaseIds)
              );
              const casesSnapshot = await getDocs(casesQuery);

              const casesData = casesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setCaseDetails(casesData);
            }
          } else {
            console.error("No lawyer document found!");
          }
        } catch (error) {
          console.error("Error fetching requested cases:", error);
        }
      } else {
        console.log("No user is logged in.");
      }
    };

    fetchRequestedCases();
  }, [currentUser, db]);

  const handleHomeClick = () => {
    navigate("/lawyer"); // Navigate to /lawyer page
  };

  // Handle Accept and Reject actions
  const handleCaseAction = async (caseId, action) => {
    try {
      const familyMemberRef = doc(db, "family_member", caseId);
      const familyMemberSnap = await getDoc(familyMemberRef);

      await updateDoc(familyMemberRef, {
        requested: arrayRemove(currentUser.uid)
      });

      if (familyMemberSnap.exists()) {
        const familyMemberData = familyMemberSnap.data();

        // Initialize requested_cases if undefined
        const requestedCases = familyMemberData.requested_cases || [];

        // Modify the requested_cases or other fields based on accept/reject
        const updatedCases =
          action === "accept"
            ? [...(familyMemberData.accepted_cases || []), caseId]
            : [...(familyMemberData.rejected_cases || []), caseId];

        // If accepted, update the lawyer's present_case and lawyer_id in family_member
        if (action === "accept") {
          const lawyerRef = doc(db, "lawyers", currentUser.uid);
          const lawyerSnap = await getDoc(lawyerRef);

          if (lawyerSnap.exists()) {
            const lawyerData = lawyerSnap.data();
            const updatedPresentCases = [
              ...(lawyerData.present_case || []),
              caseId,
            ];

            await updateDoc(lawyerRef, {
              present_case: updatedPresentCases, // Add case to present_case
            });

            console.log("Case accepted and added to present_case.");

            // Update the family member's lawyer_id field to include the current lawyer's ID
            const updatedLawyerIds = [
              ...(familyMemberData.lawyer_id || []),
              currentUser.uid,
            ];

            await updateDoc(familyMemberRef, {
              lawyer_id: updatedLawyerIds, // Add lawyer's ID to family_member
            });

            console.log("Lawyer ID added to family_member.");

            // Show the success popup and remove case from UI state
            setCaseAccepted(true);
            setShowPopup(true);

            // Update UI to reflect case acceptance (remove it from the requestedCases list)
            setRequestedCases((prevCases) =>
              prevCases.filter((caseItem) => caseItem.id !== caseId)
            );
          }
        }

        // Only remove from requested_cases if accepted
        if (action === "accept") {
          const updatedRequestedCases = requestedCases.filter(
            (id) => id !== caseId
          );

          await updateDoc(familyMemberRef, {
            requested_cases: updatedRequestedCases, // Update requested_cases field
          });
        }

        console.log(`Case ${action}ed successfully`);
      }
    } catch (error) {
      console.error(`Error ${action}ing case:`, error);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false); // Close the popup
    navigate("/lawyer"); // Navigate back to the lawyer page
  };

  return (
    <div className="pending-cases-container">
      <h2>Requested Cases</h2>

      {/* Home Button */}
      <div className="home-button" onClick={handleHomeClick}>
        <p>Home</p>
      </div>

      <div className="cards-container">
        {requestedCases.length > 0 ? (
          requestedCases.map((caseItem) => (
            <div className="case-card" key={caseItem.id}>
              <p>
                <strong>Name:</strong> {caseItem.name}
              </p>
              <p>
                <strong>Email:</strong> {caseItem.email}
              </p>
              <p>
                <strong>Phone:</strong> {caseItem.phno}
              </p>

              {/* Display case details from the cases collection */}
              <div>
                <h4>Case Status Details:</h4>
                {caseItem.case_st_id.map((caseId) => {
                  const caseDetail = caseDetails.find(
                    (c) => c.case_id === caseId
                  );
                  return caseDetail ? (
                    <div key={caseDetail.id}>
                      <p>
                        <strong>Case ID:</strong> {caseDetail.case_id}
                      </p>
                      <p>
                        <strong>Case Type:</strong> {caseDetail.case_type}
                      </p>
                      <p>
                        <strong>Case Detail:</strong> {caseDetail.case_detail}
                      </p>
                    </div>
                  ) : (
                    <p>No case details available for {caseId}</p>
                  );
                })}
              </div>

              {/* Accept and Reject Buttons */}
              <div className="action-buttons">
                <button
                  className="accept-button"
                  onClick={() => handleCaseAction(caseItem.id, "accept")}
                >
                  Accept
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleCaseAction(caseItem.id, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No requested cases found.</p>
        )}
      </div>

      {/* Popup for Case Acceptance */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Case Acceptance Successful</h3>
            <button onClick={handlePopupClose}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingCases;
