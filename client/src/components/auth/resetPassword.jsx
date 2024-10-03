// src/components/Auth/PasswordReset.jsx
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import "./auth.scss";

const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8001/api/password-reset/request", { email });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Password reset failed.");
    }
  };

  return (
    <Container className="auth-form-container">
      <h2>Password Reset</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Request Password Reset
        </Button>
      </Form>
    </Container>
  );
};

export default PasswordReset;
