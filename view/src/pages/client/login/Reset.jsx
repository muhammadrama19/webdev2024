import React, { useState } from "react";
import AuthForm from "../../../components/authform/authForm";
import FormInput from "../../../components/forminput/formInput";
import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
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
          <Button className="loginButton" type="submit">
            Reset Password
          </Button>
        </form>
      </AuthForm>
    </div>
  );
};

export default ResetPassword;
