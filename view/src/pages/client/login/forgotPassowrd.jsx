import React, { useState } from "react";
import AuthForm from "../../../components/authform/authForm";
import FormInput from "../../../components/forminput/formInput";
import { Button } from "react-bootstrap";
import axios from "axios";
import "./forgotPassowrd.scss"
import Swal from "sweetalert2";
//import scss of login

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");


  const handleForgotPassword = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8001/forgot-password", { email })
      .then((res) => {
        setMessage(res.data.message);
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.data.message,
          }); 
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.data.message,
          });
        }
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.message,
        });
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
