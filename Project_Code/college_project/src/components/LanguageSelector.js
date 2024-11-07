import React, { useState } from "react";
import globe from "../assets/images/languages.png";
import "./LanguageSelector.css"; // Create a separate CSS file for styling

const LanguageSelector = () => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="language-selector">
      <span
        className="language-icon"
        onMouseEnter={toggleOptions}
        onMouseLeave={toggleOptions}
      >
        <img
          src={globe}
          alt="Language"
          style={{ width: "30px", height: "30px" }}
        />
        {showOptions && (
          <div className="language-options">
            <p>English</p>
            <p>Español</p>
            <p>Français</p>
            <p>Deutsch</p>
            <p>हिन्दी</p>
          </div>
        )}
      </span>
    </div>
  );
};

export default LanguageSelector;
