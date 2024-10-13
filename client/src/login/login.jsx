import React, { useState } from "react";
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import GoogleLogin from "../components/googleButton/googleButton";
import { useContext } from "react";
import { RecoveryContext } from "../App";

import "./login.scss";

const LoginForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setEmail, setPage, setOTP } = useContext(RecoveryContext);

  // Handler untuk perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Jika input yang diubah adalah email, set email di RecoveryContext
    if (name === 'email') {
      setEmail(value); // Mengatur email di RecoveryContext
    }
  };

  function navigateToOtp() {
    const { email } = values; // Ambil email dari state values
    if (email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      console.log(OTP);
      setOTP(OTP);

      axios
        .post("http://localhost:8001/send_recovery_email", {
          OTP,
          recipient_email: email,
        })
        .then(() => setPage("otp"))
        .catch(console.log);
      return;
    }
    return alert("Please enter your email");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8001/login", values)
      .then((res) => {
        if (res.data.Status === "Login Success") {
          // Simpan data ke dalam cookie dengan js-cookie
          Cookies.set("username", res.data.username, { expires: 1 });
          Cookies.set("email", res.data.email, { expires: 1 });
          Cookies.set("role", res.data.role, { expires: 1 });
          Cookies.set("token", res.data.token, {
            expires: 1,
            secure: true,
            sameSite: "Strict",
          });
          navigate("/");
          window.location.reload();
        } else {
          alert(res.data.Message);
        }
      })
      .catch((err) => console.log("Login Error:", err));
  };

  return (
    <AuthForm title="Login" linkText="Don't have an account?" linkHref="/register">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="user@email.com"
          value={values.email}
          onChange={handleInputChange}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="********"
          value={values.password}
          onChange={handleInputChange}
        />
        <Container>
          <a href="/otp" onClick={() => navigateToOtp()} className="text-gray-800">
            Forgot password?
          </a>
        </Container>
        <Button type="submit" className="loginButton">Login</Button>
      </form>
    </AuthForm>
  );
};

export default LoginForm;
