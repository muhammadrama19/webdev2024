import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './formInput.scss';

const FormInput = ({ label, type, name, placeholder, value, onChange }) => {
  const [inputType, setInputType] = useState(type);

  // Fungsi untuk mengubah visibility password
  const togglePasswordVisibility = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <Form.Group controlId={name}> {/* Menggunakan name sebagai controlId */}
      <Form.Label>{label}</Form.Label>
      <div className="input-group">
        <Form.Control
          type={inputType}
          name={name} // Menambahkan name agar terhubung dengan handler onChange
          placeholder={placeholder}
          value={value} // Mengikat nilai input dengan state dari komponen induk
          onChange={onChange} // Event handler untuk menangani perubahan input
        />
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
