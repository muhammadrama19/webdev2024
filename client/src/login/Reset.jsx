import React, { useState } from "react";
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./reset.scss";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();

    axios
      .post(`http://localhost:8001/reset-password/${token}`, { newPassword })
      .then((res) => {
        alert(res.data.message); // Show success message
        navigate("/login"); // Redirect to login page
      })
      .catch((err) => {

        if (err.response) {
          const { status, data } = err.response;

          if (status === 400) {
            alert(data.message || "Invalid or expired token. Please try again.");
          } else if (status === 404) {
            alert("User not found. Please request a new reset link.");
          } else if (status === 500) {
            alert("Internal server error. Please try again later.");
          } else {
            alert("Error resetting password. Please check your input and try again.");
          }
        } else {
          alert("Network error. Please check your connection.");
        }
      });
  };

  return (
    <div className="reset">
      <AuthForm title="Reset Password">
        <form onSubmit={handleResetPassword}>
          <FormInput
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button className="loginButton" type="submit">
            Reset Password
          </Button>
        </form>
      </AuthForm>
    </div>
  );
};

export default ResetPassword;
