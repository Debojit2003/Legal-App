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
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Auth import
import axios from "axios"; // Import axios for Cloudinary upload
import "./LawyerCases.css";

const PendingCases = () => {
  const [requestedCases, setRequestedCases] = useState([]);
  const [caseDetails, setCaseDetails] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State for showing popup
  const [file, setFile] = useState(null); // State to hold the file
  const [uploading, setUploading] = useState(false); // State for file upload status
  const db = getFirestore();
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchRequestedCases = async () => {
      if (currentUser) {
        try {
          const lawyerDocRef = doc(db, "lawyers", currentUser.uid);
          const lawyerDocSnap = await getDoc(lawyerDocRef);

          if (lawyerDocSnap.exists()) {
            const lawyerData = lawyerDocSnap.data();
            const requestedCaseIds = lawyerData.requested_cases || [];

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
    navigate("/lawyer");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture the file selected by the user
  };

  const handleFileUpload = async (familyMemberId, action) => {
    if (!file) {
      console.error("No file selected!");
      return;
    }

    setUploading(true);

    // Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "sdhgimkh"); // Replace with your Cloudinary upload preset

    try {
      // Upload file to Cloudinary
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dapyza9xq/image/upload", // Replace with your Cloudinary cloud name
        formData
      );

      const uploadedUrl = res.data.secure_url; // Get the URL of the uploaded file
      console.log("File uploaded successfully:", uploadedUrl);

      // Now, update Firestore with the URL to the family_member document
      const familyMemberRef = doc(db, "family_member", familyMemberId);
      const familyMemberSnap = await getDoc(familyMemberRef);

      if (familyMemberSnap.exists()) {
        const familyMemberData = familyMemberSnap.data();
        const updatedCases =
          action === "accept"
            ? [...(familyMemberData.accepted_cases || []), uploadedUrl]
            : [...(familyMemberData.rejected_cases || []), uploadedUrl];

        // Update the family_member's document with the new URL
        await updateDoc(familyMemberRef, {
          [action === "accept" ? "accepted_cases" : "rejected_cases"]:
            updatedCases,
        });

        console.log(`File URL added to ${action}ed cases.`);

        // Show popup after successful upload
        setShowPopup(true);
        setUploading(false);

        // Close popup and navigate to /lawyer page after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
          navigate("/lawyer");
        }, 3000); // Popup will be shown for 3 seconds
      } else {
        console.error("Family member document not found.");
        setUploading(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  return (
    <div className="case-container">
      <h2>Case Record</h2>

      <div className="home-buttonlc" onClick={handleHomeClick}>
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

              <div className="action-buttons">
                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <button
                  className="Bail-Paper"
                  onClick={() => handleFileUpload(caseItem.id, "accept")}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Bail Paper"}
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
          <p>Bail Paper uploaded successfully!</p>
        </div>
      )}
    </div>
  );
};

export default PendingCases;
