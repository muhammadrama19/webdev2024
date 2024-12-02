import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import "./googleButton.scss";
import { useNavigate } from "react-router-dom";

const  apiUrl = process.env.REACT_APP_API_URL;

const GoogleLogin = ({ label }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    // Redirect to Google login
    window.location.href = `${apiUrl}/auth/google`; 
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
        text: "Your account is suspended. Please check your email for further information",  // Display the error message
      });
      //redirect to navigate login page
      navigate("/login");
    }
    else if (error === "Account_Banned") {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: "Your account is banned. Please check your email for further information.",  // Display the error message
      });
      //redirect to navigate login page
      navigate("/login");
    }
  //if its not suspended, show this message
    else if (error === "google-auth-failed") {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: "It appears your account missing credentials or doesnt exist registered by google",  // Display the error message
      });
      navigate("/login");
    }
  }, [error]);

  return (
    <Button onClick={handleGoogleLogin} className="buttonAuth">
      {label}
    </Button>
  );
};

export default GoogleLogin;
