import React from "react";
import { Button } from "react-bootstrap";
import "./googleButton.scss";

const GoogleLogin = ({ label }) => {
  const handleGoogleLogin = () => {
    window.open("http://localhost:8001/auth/google", "_self"); // Redirect to Google login
  };

  return (
    <Button onClick={handleGoogleLogin} className="buttonAuth">
      {label}
    </Button>
  );
};

export default GoogleLogin;
