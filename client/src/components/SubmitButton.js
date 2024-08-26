import React from "react";
import "../styles/submitButton.css";

const SubmitButton = ({ onClick }) => {
  return (
    <button type="submit" className="submit-button" onClick={onClick}>
      Submit
    </button>
  );
};

export default SubmitButton;
