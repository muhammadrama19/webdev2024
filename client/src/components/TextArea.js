import React from "react";
import "../styles/textArea.css";

const Textarea = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div className="textarea-group">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="textarea"
      />
    </div>
  );
};

export default Textarea;
