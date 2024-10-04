import React from "react";
import { Button } from "react-bootstrap";

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    window.open("http://localhost:8001/auth/google", "_self"); // Redirect to Google login
  };

  return (
    <Button onClick={handleGoogleLogin} className="google-login">
      Login with Google
    </Button>
  );
};

export default GoogleLogin;
