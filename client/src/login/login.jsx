import React, { useState } from 'react';
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import GoogleLogin from "../components/googleButton/googleButton"; 

import "./login.scss";

const LoginForm = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const redirectToGoogleLogin = () => {
    // Redirecting to Google login
    window.open('http://localhost:8001/auth/google', '_self');
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
  
    // Post login data
    axios.post('http://localhost:8001/login', values)
      .then(res => {
        if (res.data.Status === "Login Success") {
          // Save accessToken and refreshToken to cookies
          Cookies.set('accessToken', res.data.accessToken, { expires: 1, secure: true });
          Cookies.set('refreshToken', res.data.refreshToken, { expires: 7, secure: true }); // Refresh token lasts longer
          Cookies.set('username', res.data.username, { expires: 1 });
          Cookies.set('email', res.data.email, { expires: 1 });
          Cookies.set('role', res.data.role, { expires: 1 });

          // Redirect to home page
          navigate('/');
          window.location.reload();
        } else {
          alert(res.data.Message);
        }
      })
      .catch(err => console.log("Login Error:", err));
  };

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
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
        <Button type="submit" className="loginButton">
          Login
        </Button>

 
         <Button className='loginButtin' onClick={redirectToGoogleLogin}>
          Login with Google
        </Button>
        
      </form>
    </AuthForm>
  );
};

export default LoginForm;
