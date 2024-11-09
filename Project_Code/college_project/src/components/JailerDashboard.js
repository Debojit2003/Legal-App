import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import "./JailerDashboard.css"; // Your CSS file

const JailerDashboard = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate hook

  const db = getFirestore();

  // Fetch family member details from Firestore
  const fetchFamilyMembers = async () => {
    try {
      // Fetch family_member collection
      const querySnapshot = await getDocs(collection(db, "family_member"));
      const familyRecords = querySnapshot.docs.map((doc) => doc.data());
      setFamilyMembers(familyRecords);

      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const handleHomeClick = () => {
    navigate("/jail-authority"); // Navigate to the jail_authority page
  };

  return (
    <div className="jailer-dashboard-container">
      <header className="header">
        <button className="home-button" onClick={handleHomeClick}>
          Home
        </button>
        <h1 className="title">Family Member Details</h1>
      </header>

      <div className="content-section">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="family-member-list">
            {familyMembers.length === 0 ? (
              <p>No family member data available.</p>
            ) : (
              familyMembers.map((member, index) => (
                <div key={index} className="family-member-card">
                  <h2>{member.name}</h2>
                  <p>
                    <strong>Address:</strong> {member.address}
                  </p>
                  <p>
                    <strong>Email:</strong> {member.email}
                  </p>
                  <p>
                    <strong>Bail Consideration:</strong>{" "}
                    {member.bail_consideration ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {member.phno}
                  </p>
                  <p>
                    <strong>Case ID:</strong> {member.case_st_id?.join(", ")}
                  </p>
                  <p>
                    <strong>Lawyer ID:</strong> {member.lawyer_id?.join(", ")}
                  </p>
                  <p>
                    <strong>NGO ID:</strong> {member.ngo_id?.join(", ")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JailerDashboard;
