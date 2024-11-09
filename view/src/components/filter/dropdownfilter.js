import React from "react";
import "./dropdownfilter.scss";

const DropdownFilter = ({ label, options, onSelect }) => {
  return (
    <div className="dropdown-filter-container">
      <div className="dropdown-filter">
        <select onChange={(e) => onSelect(e.target.value)}>
          <option>{label}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownFilter;
