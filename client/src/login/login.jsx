<<<<<<< HEAD
import React, { useState } from 'react';
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

import GoogleLogin from "../components/googleButton/googleButton";
=======
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
>>>>>>> 1782fe1ea812b9325200dd2923b485ccbb8ae7b2

import "./login.scss";

const LoginForm = () => {
  const [values, setValues] = useState({
<<<<<<< HEAD
    email: '',
    password: ''
=======
    email: "",
    password: "",
>>>>>>> 1782fe1ea812b9325200dd2923b485ccbb8ae7b2
  });

  const navigate = useNavigate();

<<<<<<< HEAD
  axios.defaults.withCredentials = true;



  const handleSubmit = (e) => {
    e.preventDefault(); 
  
    // Post login data
    axios.post('http://localhost:8001/login', values)
      .then(res => {
        if (res.data.Status === "Login Success") {

          // Simpan data ke dalam cookie dengan js-cookie
          Cookies.set('username', res.data.username, { expires: 1 }); // Set cookie username dengan kadaluarsa 1 hari
          Cookies.set('email', res.data.email, { expires: 1 }); // Set cookie email
          Cookies.set('role', res.data.role, { expires: 1 }); // Set cookie role
          Cookies.set('token', res.data.token, { expires: 1, secure: true, sameSite: 'Strict' }); // Set cookie JWT token
          Cookies.set('user_id', res.data.id, { expires: 1 }); // Set cookie user_id

          navigate('/');
=======
  const { setEmail, setPage, setOTP } = useContext(RecoveryContext);

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Post login data
    axios
      .post("http://localhost:8001/login", values)
      .then((res) => {
        if (res.data.Status === "Login Success") {
          // Simpan data ke dalam cookie dengan js-cookie
          Cookies.set("username", res.data.username, { expires: 1 }); // Set cookie username dengan kadaluarsa 1 hari
          Cookies.set("email", res.data.email, { expires: 1 }); // Set cookie email
          Cookies.set("role", res.data.role, { expires: 1 }); // Set cookie role
          Cookies.set("token", res.data.token, {
            expires: 1,
            secure: true,
            sameSite: "Strict",
          }); // Set cookie JWT token
          Cookies.set("user_id", res.data.id, { expires: 1 }); // Set cookie user_id

          navigate("/");
>>>>>>> 1782fe1ea812b9325200dd2923b485ccbb8ae7b2
          window.location.reload();
        } else {
          alert(res.data.Message);
        }
      })
<<<<<<< HEAD
      .catch(err => console.log("Login Error:", err));
  };

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  return (

    <div className='login'>
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

        <Button type="submit" className="loginButton">
          Login
        </Button>
        <GoogleLogin label={"Login with Google"} />
        

      </form>
    </AuthForm>
    </div>
    
=======
      .catch((err) => console.log("Login Error:", err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Jika input yang diubah adalah email, set email di RecoveryContext
    if (name === "email") {
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

  return (
    <div className="login">
      <AuthForm
        title="Login"
        linkText="Don't have an account?"
        linkHref="/register"
      >
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
            <a
              href="/forgot-password"
              className="text-gray-800"
            >
              Forgot password?
            </a>
          </Container>
          <Button type="submit" className="loginButton">
            Login
          </Button>
          <GoogleLogin label={"Login with Google"} />
        </form>
      </AuthForm>
    </div>
>>>>>>> 1782fe1ea812b9325200dd2923b485ccbb8ae7b2
  );
};

export default LoginForm;
