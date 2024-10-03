// src/login/login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8001/api/signin', formData);
      console.log('Sign-in response:', response.data); // Log response to check structure
  
      if (response.data.token) {
        const userData = {
          token: response.data.token,
          profile_picture: response.data.profile_picture // Store profile picture
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        alert(response.data.message);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('SignIn failed. Please check your credentials.');
    }
  };
  

  return (
    <div>
      <h2>SignIn</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          SignIn
        </Button>
      </Form>
    </div>
  );
};

export default SignIn;
