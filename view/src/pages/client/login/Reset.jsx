import React, { useState } from "react";
import AuthForm from "../../../components/authform/authForm";
import FormInput from "../../../components/forminput/formInput";
import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./reset.scss";

const  apiUrl = process.env.REACT_APP_API_URL;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      Swal.fire(
        "Error",
        "Password must contain at least one uppercase letter",
        "error"
      )
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      Swal.fire(
        "Error",
        "Password must contain at least one lowercase letter",
        "error"
      )
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      Swal.fire(
        "Error",
        "Password must contain at least one number",
        "error"
      )
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      Swal.fire(
        "Error",
        "Password must contain at least one special character",
        "error"
      )
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    axios
      .post(`${apiUrl}/reset-password/${token}`, { newPassword })
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: res.data.message,
          icon: "success",
        }).then(() => {
          navigate("/login"); // Redirect to login page
        });
      })
      .catch((err) => {
        if (err.response) {
          const { status, data } = err.response;

          if (status === 400) {
            Swal.fire("Error", data.message || "Invalid or expired token. Please try again.", "error");
          } else if (status === 404) {
            Swal.fire("Error", "User not found. Please request a new reset link.", "error");
          } else if (status === 500) {
            Swal.fire("Error", "Internal server error. Please try again later.", "error");
          } else {
            Swal.fire("Error", "Error resetting password. Please check your input and try again.", "error");
          }
        } else {
          Swal.fire("Network Error", "Please check your connection and try again.", "error");
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
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button className="loginButton" type="submit">
            Reset Password
          </Button>
        </form>
      </AuthForm>
    </div>
  );
};

export default ResetPassword;