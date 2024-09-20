import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import "./dropdownFilter.scss"; // Ensure this path is correct

const DropdownFilterCustom = ({ label, options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <Dropdown className="dropdown-filter">
      <Dropdown.Toggle>
        {selectedOption || `${label}`}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleSelect("")}>Select {label}</Dropdown.Item>
        {options.map((option, index) => (
          <Dropdown.Item key={index} onClick={() => handleSelect(option)} className="select">
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

DropdownFilterCustom.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DropdownFilterCustom;
