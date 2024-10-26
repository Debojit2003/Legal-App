import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import googleLogo from "../assets/images/google.png"; // Import Google logo
import appleLogo from "../assets/images/apple.png"; // Import Apple logo
import profileuser from "../assets/images/profile-user.png";
import passopen from "../assets/images/eye.png";
import passclose from "../assets/images/hide.png";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Adjust the path to your actual `firebase.js` location
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

const LoginPage = () => {
  const navigate = useNavigate();

  // State to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Function to toggle the password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

    const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const selectedRole = e.target.role.value; // Get the selected role

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's role from Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Compare the roles and redirect based on role
        if (userRole === selectedRole) {
          alert('Login successful!');
          switch (userRole) {
            case 'Family-Member':
              navigate('/family-member');
              break;
            case 'Lawyer':
              navigate('/lawyer');
              break;
            case 'Jail-Authority':
              navigate('/jail-authority');
              break;
            default:
              alert('Unknown role');
          }
        } else {
          alert('Role mismatch. Please select the correct role.');
        }
      } else {
        alert('No such user found in Firestore.');
      }
    } catch (error) {
      alert(`Error signing in: ${error.message}`);
    }
  };


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
        <form className="auth-form" onSubmit={handleLogin}>
          <label>Sign In as</label>
          <select name="role">
            <option value="" disabled selected>Select user category</option>
            <option>Family-Member</option>
            <option>Lawyer</option>
            <option>Jail-Authority</option>
          </select>

          <input name="email" type="text" placeholder="User name or Email ID" />
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
