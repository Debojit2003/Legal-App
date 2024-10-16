import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import googleLogo from "../assets/images/google.png"; // Import Google logo
import appleLogo from "../assets/images/apple.png"; // Import Apple logo
import profileuser from "../assets/images/profile-user.png";
const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="title">TrialTech</h1>
        <div className="icon-section">
          <img src={profileuser} alt="login icon" />
        </div>
        <div className="auth-buttons">
          <button className="btn active">Sign In</button>
          <button className="btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
        <form className="auth-form">
          <label>Sign In as</label>
          <select>
            <option>Prisoner</option>
            <option>Lawyer</option>
            <option>Jail-Authority</option>
          </select>

          <input type="text" placeholder="User name or Email ID" />
          <div className="password-container">
            <input type="password" placeholder="Password" />
            <span className="toggle-password">👁️</span>
          </div>

          <button type="submit" className="btn sign-in-btn">
            Sign In
          </button>
        </form>
        <div className="forgot-password">
          <a href="#">Forgot Password?</a> <a href="#">Try another way</a>
        </div>
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

export default LoginPage;
