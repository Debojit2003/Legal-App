import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignupPage from "../components/SignupPage";
import LoginPage from "../components/LoginPage";
import LawyerPage from "../components/LawyerPage";
const AuthRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/lawyer" element={<LawyerPage />} />
        <Route path="/jail-authority" element={<JailAuthorityPage />} />
        <Route path="/family-member" element={<FamilyMemberPage />} />
        
      </Routes>
    </Router>
  );
};

export default AuthRoutes;
