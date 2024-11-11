import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignupPage from "../components/SignupPage";
import LoginPage from "../components/LoginPage";
import LawyerPage from "../components/LawyerPage";
import JailAuthorityPage from "../components/JailAuthorityPage";
import FamilyMemberPage from "../components/Family_member";
import AboutUsPage from "../components/AboutUsPage";
import AboutUsfamily from "../components/AboutUsfamily";
import AboutUsjail from "../components/AboutUsJail";
import ProfilePage from "../components/Profile";
import LawyerCases from "../components/LawyerCases";
import JailerDashboard from "../components/JailerDashboard";
import LawyerSearch from "../components/LawyerSearch";
import FamilyCase from "../components/FamilyMemberCases.js";
import NGODetailsPage from "../components/NGODetailsPage.js";
import PendingCases from "../components/PendingCases.js";
import FMForm from "../components/FamilyMemberDetailsForm.js"
import LForm from "../components/LawyerDetailsForm.js"
//mport NGODetailsPage from "../components/NGODetailsPage.js";
const AuthRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/lawyerSearch" element={<LawyerSearch />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/lawyer" element={<LawyerPage />} />
        <Route path="/jail-authority" element={<JailAuthorityPage />} />
        <Route path="/family-member" element={<FamilyMemberPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/about-family" element={<AboutUsfamily />} />
        <Route path="/aboutjail" element={<AboutUsjail />} />
        <Route path="/lawyer-cases" element={<LawyerCases />} />
        <Route path="/dashboard" element={<JailerDashboard />} />
        <Route path="/family-case" element={<FamilyCase />} />
        <Route path="/ngo-details" element={<NGODetailsPage />} />
        <Route path="/pending-case" element={<PendingCases />} />
        <Route path="/fmform" element={<FMForm />} />
        <Route path="/lawyerform" element={<LForm />} />
      </Routes>
    </Router>
  );
};

export default AuthRoutes;
