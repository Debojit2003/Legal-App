import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignupPage from "../components/SignupPage";
import LoginPage from "../components/LoginPage";

const AuthRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default AuthRoutes;
