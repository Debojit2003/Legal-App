import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContactUsForm from "./ContactUsForm";
import "./About.css"; // Create this CSS file for styling

const AboutUsPage = () => {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);

  const openContactForm = () => setShowContactForm(true);
  const closeContactForm = () => setShowContactForm(false);

  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>About Us</h1>
      </header>
      <main className="about-us-content">
        <div className="about-us-card">
          <p>
            The project endeavors to develop technology-driven solutions aimed
            at addressing the complex challenges encountered by undertrial
            prisoners in India. Through the utilization of innovative software
            applications, the initiative seeks to tackle critical issues such as
            limited access to legal aid, barriers to justice, and the absence of
            effective rehabilitation programs. These solutions are intended to
            bridge existing gaps in the legal system, enhance operational
            efficiency, and facilitate equitable access to justice for
            underprivileged individuals involved in the legal process.
          </p>
          <p>
            At the core of the project's objectives is empowering undertrial
            prisoners by providing essential legal support and resources.
            Additionally, the initiative aims to facilitate the smooth
            reintegration of released prisoners into society by providing
            rehabilitation opportunities and support services. By harnessing the
            potential of technology, the project aspires to transform the
            landscape of undertrial prisoner welfare, promoting fairness,
            transparency, and inclusivity within the Indian justice system.
          </p>
          <p>
            Ultimately, the endeavor seeks to contribute to advancing a more
            just and compassionate society where all individuals, irrespective
            of their circumstances, are afforded their fundamental rights and
            opportunities for rehabilitation and reintegration.
          </p>
        </div>
      </main>
      <footer className="about-us-footer">
        <button onClick={() => navigate("/lawyer")}>Home</button>
        <p>&copy; TrialTech 2024</p>
        <button onClick={openContactForm}>Contact Us</button>
      </footer>
      {showContactForm && <ContactUsForm onClose={closeContactForm} />}
    </div>
  );
};

export default AboutUsPage;
