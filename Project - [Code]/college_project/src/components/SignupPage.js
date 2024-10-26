import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import googleLogo from "../assets/images/google.png"; // Import Google logo
import appleLogo from "../assets/images/apple.png"; // Import Apple logo
import profileuser from "../assets/images/profile-user.png";
import passopen from "../assets/images/eye.png";
import passclose from "../assets/images/hide.png";

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Adjust the path to your actual `firebase.js` location
import { getFirestore, doc, setDoc } from "firebase/firestore";

const SignupPage = () => {
  const navigate = useNavigate();

  // State to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Function to toggle the password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Function to handle user registration
  const handleRegistration = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save the user's role in Firestore
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
      });

      alert("Registration successful!");
      navigate("/"); // Redirect to the home page or another page
    } catch (error) {
      alert(`Error creating account: ${error.message}`);
      // Handle any errors (e.g., invalid email, weak password, etc.)
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="title">TrialTech</h1>
        <div className="icon-section">
          <img src={profileuser} alt="profile-user" />
        </div>
        <div className="auth-buttons">
          <button className="btn" onClick={() => navigate("/")}>
            Sign In
          </button>
          <button className="btn active">Sign Up</button>
        </div>
        <form className="auth-form" onSubmit={handleRegistration}>
          <label>Sign In as</label>
          <select name="role">
            <option value="" disabled selected>Select user category</option>
            <option>Family-Member</option>
            <option>Lawyer</option>
            <option>Jail-Authority</option>
          </select>
          <input type="text" placeholder="Full Name" />
          <input type="email" name="email" placeholder="Email" />
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
            />
            <span
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ?(
                <img 
                  src={passopen} 
                  alt="Show Password"
                  style={{ width: '20px', height: '20px' }}
               />
              ) : (
                <img 
                  src={passclose} 
                  alt="Hide Password" 
                  style={{ width: '20px', height: '20px' }}
               />
              )}
            </span>
          </div>
          <button type="submit" className="btn sign-up-btn">
            Sign Up
          </button>
        </form>
        <div className="auth-socials">
          <button className="social-btn google-btn">
            <img src={googleLogo} alt="Google Logo" className="social-icon" />
            Sign up with Google
          </button>
          <button className="social-btn apple-btn">
            <img src={appleLogo} alt="Apple Logo" className="social-icon" />
            Sign up with Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

