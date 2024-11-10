import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./JailerDashboard.css";

const JailerDashboard = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNGOs, setSelectedNGOs] = useState({});
  const navigate = useNavigate();

  const db = getFirestore();

  // Fetch family members data from Firestore
  const fetchFamilyMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "family_member"));
      const familyRecords = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFamilyMembers(familyRecords);
    } catch (error) {
      console.error("Error fetching family members: ", error);
    }
  };

  // Fetch NGOs data from Firestore
  const fetchNgos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ngo"));
      const ngosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        address: doc.data().address,
        contact_info: doc.data().contact_info,
        report: doc.data().report,
        seatno: doc.data().seatno,
      }));
      const filteredNgos = ngosData.filter((ngo) => ngo.seatno > 0);
      setNgos(filteredNgos);
    } catch (error) {
      console.error("Error fetching NGOs: ", error);
    }
  };

  // Fetch lawyer data from Firestore
  const fetchLawyers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "lawyers"));
      const lawyersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setLawyers(lawyersData);
    } catch (error) {
      console.error("Error fetching lawyers: ", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFamilyMembers(), fetchNgos(), fetchLawyers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleHomeClick = () => {
    navigate("/jail-authority");
  };

  // Handle NGO selection for family member
  const handleNGOSelect = async (memberId, ngoId) => {
    if (!ngoId || !memberId) return;

    try {
      setLoading(true);

      // Fetch NGO document
      const ngoRef = doc(db, "ngo", ngoId);
      const ngoSnapshot = await getDoc(ngoRef);

      if (!ngoSnapshot.exists()) {
        throw new Error("NGO not found");
      }

      const ngoData = ngoSnapshot.data();

      // Check seat availability
      if (ngoData.seatno <= 0) {
        alert("No seats available for this NGO");
        return;
      }

      // Update NGO document
      await updateDoc(ngoRef, {
        seatno: ngoData.seatno - 1,
        family_member_id: arrayUnion(memberId),
      });

      // Update family member document to add selected NGO ID to ngo_id array
      const familyMemberRef = doc(db, "family_member", memberId);
      await updateDoc(familyMemberRef, {
        ngo_id: arrayUnion(ngoId),
      });

      // Update selected NGOs state
      setSelectedNGOs((prev) => ({
        ...prev,
        [memberId]: ngoId,
      }));

      alert("NGO successfully assigned!");

      // Refresh data
      await fetchNgos();
      await fetchFamilyMembers();
    } catch (error) {
      console.error("Error selecting NGO:", error);
      alert("Failed to assign NGO. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get lawyer names based on lawyer IDs in family member data
  const getLawyerName = (lawyerIds) => {
    return lawyerIds
      .map((lawyerId) => {
        const lawyer = lawyers.find((lawyer) => lawyer.id === lawyerId);
        return lawyer ? lawyer.name : "Unknown Lawyer";
      })
      .join(", ");
  };

  // Get NGO details based on ngo_id linked in family member data
  const getNGODetails = (ngoId) => {
    const ngo = ngos.find((ngo) => ngo.id === ngoId);
    return ngo ? (
      <>
        <p>
          <strong>Name:</strong> {ngo.name}
        </p>
        <p>
          <strong>Address:</strong> {ngo.address}
        </p>
        <p>
          <strong>Contact:</strong> {ngo.contact_info}
        </p>
        <p>
          <strong>Report:</strong> {ngo.report}
        </p>
      </>
    ) : (
      <p>No NGO assigned</p>
    );
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
              familyMembers.map((member) => (
                <div key={member.id} className="family-member-card">
                  <h2>{member.name}</h2>
                  <p>
                    <strong>Address:</strong> {member.address}
                  </p>
                  <p>
                    <strong>Email:</strong> {member.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {member.phno}
                  </p>
                  <p>
                    <strong>Case IDs:</strong> {member.case_st_id?.join(", ")}
                  </p>
                  <p>
                    <strong>Lawyer:</strong>{" "}
                    {member.lawyer_id
                      ? getLawyerName(member.lawyer_id)
                      : "No lawyer assigned"}
                  </p>
                  <p>
                    <strong>NGO IDs:</strong> {member.ngo_id?.join(", ")}
                  </p>

                  {member.ngo_id?.length === 0 && (
                    <div className="ngo-dropdown">
                      <label htmlFor={`ngo-${member.id}`}><h3>Select NGO:</h3></label>
                      <select
                        id={`ngo-${member.id}`}
                        value={selectedNGOs[member.id] || ""}
                        onChange={(e) =>
                          handleNGOSelect(member.id, e.target.value)
                        }
                        disabled={loading}
                      >
                        <option value="">Select an NGO</option>
                        {ngos.map((ngo) => (
                          <option key={ngo.id} value={ngo.id}>
                            {ngo.name} - {ngo.address} (Seats: {ngo.seatno})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedNGOs[member.id] && (
                    <div className="selected-ngo-info">
                      <h4>Selected NGO Details:</h4>
                      {getNGODetails(selectedNGOs[member.id])}
                    </div>
                  )}
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
