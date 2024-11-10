import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./NGODetailsPage.css"; // Add your CSS file for styling

const NGODetailsPage = () => {
  const [ngoDetails, setNgoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchNGODetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch the current user's family member data
          const familyMemberRef = doc(db, "family_member", user.uid); // Assuming user.uid maps to the family member ID
          const familyMemberDoc = await getDoc(familyMemberRef);

          if (familyMemberDoc.exists()) {
            const familyMemberData = familyMemberDoc.data();
            const ngoId = familyMemberData.ngo_id[0]; // Assuming ngo_id is an array

            if (ngoId) {
              // Fetch the NGO details using the ngoId
              const ngoRef = doc(db, "ngo", ngoId);
              const ngoDoc = await getDoc(ngoRef);

              if (ngoDoc.exists()) {
                setNgoDetails(ngoDoc.data());
              } else {
                console.log("No NGO found with this ID");
              }
            } else {
              console.log("No NGO ID found in family member data");
            }
          } else {
            console.log("No family member data found");
          }
        }
      } catch (error) {
        console.error("Error fetching NGO details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNGODetails();
  }, [db, auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ngoDetails) {
    return <div>No NGO details available.</div>;
  }

  return (
    <div className="ngo-details-container">
      <h1>NGO Details</h1>
      <div className="ngo-details-card">
        <h2>{ngoDetails.name}</h2>
        <p>
          <strong>Address:</strong> {ngoDetails.address}
        </p>
         <p>
          <strong>Contact Info:</strong> {ngoDetails.contact_info}
        </p>
        <p>
          <strong>Report:</strong> {ngoDetails.report}
        </p>
        {/* <p>
          <strong>Seat Number:</strong> {ngoDetails.seatno}
        </p> */}
      </div>
      <button
        className="back-button"
        onClick={() => navigate("/family-member")}
      >
        <h2>Back to Dashboard</h2>
      </button>
    </div>
  );
};

export default NGODetailsPage;
