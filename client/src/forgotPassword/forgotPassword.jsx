import React, { useState } from 'react';
import { Button } from "react-bootstrap";
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8001/forgot-password', { email })
      .then((res) => {
        setMessage(res.data.message); // Success message
      })
      .catch((err) => {
        setMessage('Error: Unable to send password reset link');
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="submitButton">
          Send Reset Link
        </Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
