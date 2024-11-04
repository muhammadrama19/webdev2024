import React, { useState } from 'react';
import AuthForm from "../components/authform/authForm";
import { Container } from "react-bootstrap";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import GoogleLogin from "../components/googleButton/googleButton";

import "./login.scss";

const LoginForm = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  

  const handleSubmit = (e) => {
    e.preventDefault(); 
  
    // Post login data
    axios.post('http://localhost:8001/login', values)
      .then(res => {
        if (res.data.Status === "Login Success") {
          // Simpan data ke dalam cookie dengan js-cookie
          console.log(res);
          Cookies.set('username', res.data.username, { expires: 1 }); // Set cookie username dengan kadaluarsa 1 hari
          Cookies.set('email', res.data.email, { expires: 1 }); // Set cookie email
          Cookies.set('role', res.data.role, { expires: 1 }); // Set cookie role
          Cookies.set('token', res.data.token, { expires: 1, secure: true, sameSite: 'Strict' }); // Set cookie JWT token
          Cookies.set('user_id', res.data.id, { expires: 1 }); // Set cookie user_id

          navigate('/');
          window.location.reload();
        } else if(res.data.Status === "Account Suspended") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.data.Message,
          });

        } else {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.data.Message,
            });
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
    
  );
};

export default LoginForm;
