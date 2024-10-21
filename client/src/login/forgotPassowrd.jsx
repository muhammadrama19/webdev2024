import React, { useState } from "react";
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import axios from "axios";
import "./forgotPassowrd.scss"
//import scss of login

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8001/forgot-password", { email })
      .then((res) => {
        alert(res.data.message); // Show success message
      })
      .catch((err) => {
        console.log(err);
        alert("Error sending reset link");
      });
  };

  return (
    <div className="forgotpass">
    <AuthForm title="Forgot Password">
      <form onSubmit={handleForgotPassword}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button className="loginButton"type="submit">Send Reset Link</Button>
      </form>
    </AuthForm>
    </div>
  );
};

export default ForgotPassword;
