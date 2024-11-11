import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import "./BailConsider.css";

const BailConsider = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileURL, setFileURL] = useState(null); // To store the bail paper link
  const navigate = useNavigate();
  const db = getFirestore();

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

  const fetchLawyers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "lawyers"));
      const lawyersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
      }));
      setLawyers(lawyersData);
    } catch (error) {
      console.error("Error fetching lawyers: ", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFamilyMembers(), fetchLawyers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleHomeClick = () => {
    navigate("/jail-authority");
  };

  const handleBailPaperClick = async (memberId) => {
    setLoading(true);
    const familyMemberRef = doc(db, "family_member", memberId);
    const familyMemberSnapshot = await getDoc(familyMemberRef);
    const familyMemberData = familyMemberSnapshot.data();
    setFileURL(familyMemberData.accepted_cases?.[0] || null); // Set fileURL if bail paper exists
    setLoading(false);
  };

  const handleAccept = async (memberId, lawyerId) => {
    setLoading(true);
    const familyMemberRef = doc(db, "family_member", memberId);
    await updateDoc(familyMemberRef, { status: "Accepted" });
    alert("Bail-Paper accepted");

    const lawyer = lawyers.find((lawyer) => lawyer.id === lawyerId);
    if (lawyer && lawyer.email) {
      sendEmailToLawyer(lawyer.email, "Bail Accepted Notification", memberId);
    }

    navigate("/jail-authority");
    await fetchFamilyMembers();
    setLoading(false);
  };

  const handleReject = async (memberId) => {
    setLoading(true);
    const familyMemberRef = doc(db, "family_member", memberId);
    await updateDoc(familyMemberRef, { status: "Rejected" });
    alert("Bail-Paper rejected");

    navigate("/jail-authority");
    await fetchFamilyMembers();
    setLoading(false);
  };

  const sendEmailToLawyer = (toEmail, subject, familyMemberId) => {
    const templateParams = {
      to_email: toEmail,
      subject: subject,
      message: `The bail paper for family member ID ${familyMemberId} has been accepted.`,
    };

    emailjs
      .send(
        "service_6ftpuxm",
        "template_ywvruik",
        templateParams,
        "CgB5WhTSFJl5RwHX7"
      )
      .then((response) => {
        console.log("Email sent successfully:", response.status, response.text);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const getLawyerName = (lawyerIds) => {
    if (!lawyerIds || lawyerIds.length === 0) return "No lawyer assigned";
    const lawyer = lawyers.find((lawyer) => lawyer.id === lawyerIds[0]);
    return lawyer ? lawyer.name : "Unknown lawyer";
  };

  return (
    <div className="bail-consider-container">
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
                    <strong>Lawyer:</strong> {getLawyerName(member.lawyer_id)}
                  </p>

                  <button onClick={() => handleBailPaperClick(member.id)}>
                    View Bail Paper
                  </button>
                  {fileURL && (
                    <p>
                      <a
                        href={fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Bail Paper Document
                      </a>
                    </p>
                  )}

                  <div className="action-buttons">
                    <button
                      onClick={() =>
                        handleAccept(member.id, member.lawyer_id[0])
                      }
                    >
                      Bail-Accept
                    </button>

                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BailConsider;
