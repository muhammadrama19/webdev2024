import React from "react";
import "../styles/backButton.css";

const BackButton = ({ onClick }) => {
  return (
    <button type="button" className="back-button" onClick={onClick}>
      Back
    </button>
  );
};

export default BackButton;
