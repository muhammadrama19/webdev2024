import React from "react";
import "../styles/checkboxGroup.css";

const CheckboxGroup = ({ label, name, options, selectedOptions, onChange }) => {
  return (
    <div className="checkbox-group">
      <label>{label}</label>
      <div className="checkbox-options">
        {options.map((option, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
