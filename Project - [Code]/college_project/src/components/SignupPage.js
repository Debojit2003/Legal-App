import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import googleLogo from "../assets/images/google.png"; // Import Google logo
import appleLogo from "../assets/images/apple.png"; // Import Apple logo
import profileuser from "../assets/images/profile-user.png";

const SignupPage = () => {
  const navigate = useNavigate();

  // State to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Function to toggle the password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
        <form className="auth-form">
          <label>Sign In as</label>
          <select>
            <option>Prisoner</option>
            <option>Lawyer</option>
            <option>Jail-Authority</option>
          </select>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <div className="password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
            />
            <span
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? "🙈" : "👁️"}
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
