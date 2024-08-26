import React from "react";
import "../styles/inputText.css";

const InputText = ({ label, name, value, onChange, placeholder }) => {
  return (
    <div className="input-text-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-text"
      />
    </div>
  );
};

export default InputText;
