import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import "./googleButton.scss";

const GoogleLogin = ({ label }) => {
  const [error, setError] = useState(null);

  const handleGoogleLogin = () => {
    // Redirect to Google login
    window.location.href = "http://localhost:8001/auth/google"; 
  };

  useEffect(() => {
    // Check if there's an error in the query params (after callback)
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get("error");

    if (errorMessage) {
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {

    
    // If an error is set, show it using SweetAlert or alert
    if (error === "Account_Suspended") {
    
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: "Your account is suspended",  // Display the error message
      });
    }
  //if its not suspended, show this message
    else if (error === "google-auth-failed") {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: "It appears your account missing credentials or doesnt exist registered by google",  // Display the error message
      });
    }
  }, [error]);

  return (
    <Button onClick={handleGoogleLogin} className="buttonAuth">
      {label}
    </Button>
  );
};

export default GoogleLogin;
