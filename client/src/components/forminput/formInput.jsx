import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './formInput.scss';

const FormInput = ({ label, type, placeholder }) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <Form.Group controlId={label}>
      <Form.Label>{label}</Form.Label>
      <div className="input-group">
        <Form.Control type={inputType} placeholder={placeholder} />
        {type === 'password' && (
          <span className="toggle-password" onClick={togglePasswordVisibility}>
            {inputType === 'password' ? <VisibilityOff /> : <Visibility />}
          </span>
        )}
      </div>
    </Form.Group>
  );
};

export default FormInput;
