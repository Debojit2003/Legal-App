import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import profileuser from "../assets/images/profile-user.png";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase"; // Adjust the path to your actual firebase.js location

const FamilyFormPage = () => {
  const navigate = useNavigate();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phno: "",
    address: "",
    case_st_id: "",
    case_details: "",
    case_type: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert("User not authenticated");
        return;
      }

      try {
        const userDocRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const { email, name } = userSnapshot.data();
          setFormData((prevData) => ({
            ...prevData,
            email,
            name,
          }));
        } else {
          console.error("User document not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitFamilyForm = async (e) => {
    e.preventDefault();
    const { email, name, phno, address, case_st_id, case_details, case_type } = formData;

    try {
      const familyMemberId = auth.currentUser?.uid;
      if (!familyMemberId) {
        alert("User not authenticated");
        return;
      }

      // Save case information in the "cases" collection using case_st_id as the document ID
      const caseDocRef = doc(db, "cases", case_st_id);  // Use case_st_id as the document ID
      await setDoc(caseDocRef, {
        case_id:case_st_id,
        case_detail:case_details,
        case_type,  // Store case_type in the case document
      });

      // Save family member data in the "family_member" collection
      const familyMemberRef = doc(db, "family_member", familyMemberId); // Use familyMemberId as the document ID
      await setDoc(familyMemberRef, {
        id: familyMemberId, // Store the id in the document
        email,
        name,
        phno,
        address,
        case_st_id:[case_st_id], // Store the case_st_id directly here
        bail_consideration: true,  // Set default values for other fields as placeholders
        ngo_id: [],
        lawyer_id: [],
      });

      alert("Family member data successfully saved!");
      navigate("/family-member"); // Navigate to a different page on success
    } catch (error) {
      console.error("Error saving family member data:", error);
      alert("Failed to save family member data. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="title">TrialTech</h1>
        <div className="icon-section">
          <img src={profileuser} alt="profile-user" />
        </div>
        <form className="info-form" onSubmit={submitFamilyForm}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
          />

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phno"
            value={formData.phno}
            onChange={handleChange}
            required
          />

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <label>Case ID</label>
          <input
            type="text"
            name="case_st_id"
            value={formData.case_st_id}
            onChange={handleChange}
            required
          />

          <label>Case Details</label>
          <textarea
            name="case_details"
            value={formData.case_details}
            onChange={handleChange}
            required
          />

          <label>Case Type</label>
          <select
            name="case_type"
            value={formData.case_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Case Type</option>
            <option value="Criminal Defense Lawyer">Criminal Defense Lawyer</option>
            <option value="Corporate Lawyer">Corporate Lawyer</option>
            <option value="Environmental Lawyer">Environmental Lawyer</option>
            <option value="Technology/Tech Lawyer">Technology/Tech Lawyer</option>
            <option value="Civil Litigation Attorney">Civil Litigation Attorney</option>
            <option value="Constitutional Lawyer">Constitutional Lawyer</option>
            <option value="Labor & Employment Attorney">Labor & Employment Attorney</option>
            <option value="International Law Attorney">International Law Attorney</option>
            <option value="Intellectual Property Lawyer">Intellectual Property Lawyer</option>
          </select>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FamilyFormPage;
