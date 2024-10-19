import React, { useState } from 'react';
import AuthForm from "../components/authform/authForm";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import "./forgotPassword.scss";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    axios.post('http://localhost:8001/forgot-password', { email })
      .then(res => {
        if (res.data.success) {
          setMessage('Check your email for the password reset link.');
        } else {
          setMessage('Failed to send reset email. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error sending reset email:', err); // Log the error
        if (err.response) {
          console.error('Response data:', err.response.data); // Log the response data for more context
          setMessage(err.response.data.message || 'An error occurred. Please try again later 1.');
        } else {
          setMessage('An error occurred. Please try again later. 2');
        }
      });
  };  

  return (
    <AuthForm title="Forgot Password" linkText="Remembered your password?" linkHref="/login">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ color: 'black' }}
        />
        <Button type="submit" className="loginButton">
          Send Reset Email
        </Button>
      </form>
      {message && <p>{message}</p>}
    </AuthForm>
  );
};

export default ForgotPasswordForm;
