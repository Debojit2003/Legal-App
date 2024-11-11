import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import profileuser from "../assets/images/profile-user.png";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase"; // Adjust the path to your actual firebase.js location

const LawyerFormPage = () => {
  const navigate = useNavigate();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phno: "",
    address: "",
    type: "",
    court_area: "",
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

  const submitLawyerForm = async (e) => {
    e.preventDefault();
    const { email, name, phno, address, type, court_area } = formData;

    try {
      const lawyerId = auth.currentUser?.uid;
      if (!lawyerId) {
        alert("User not authenticated");
        return;
      }

      const lawyerRef = doc(db, "lawyers", lawyerId); // Using lawyerId as the document ID in "lawyers" collection
      await setDoc(lawyerRef, {
        id: lawyerId,       // Storing the ID in the document
        email,
        name,
        phno,
        address,
        type,
        court_area,
        present_case: [],   // Blank array for present cases
        past_case: [],      // Blank array for past cases
        requested_cases: [], // Blank array for requested cases
      });

      alert("Lawyer data successfully saved!");
      navigate("/lawyer"); // Navigate to a different page on success
    } catch (error) {
      console.error("Error saving lawyer data:", error);
      alert("Failed to save lawyer data. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="title">TrialTech</h1>
        <div className="icon-section">
          <img src={profileuser} alt="profile-user" />
        </div>
        <form className="info-form" onSubmit={submitLawyerForm}>
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

          <label>Lawyer Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Lawyer Type</option>
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

          <label>Court Area</label>
          <input
            type="text"
            name="court_area"
            value={formData.court_area}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LawyerFormPage;
