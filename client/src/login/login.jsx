import React, { useState } from 'react';
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import "./login.scss";

const LoginForm = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Mengaktifkan kredensial untuk memungkinkan pengiriman cookie dari backend
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman

    // Melakukan POST request ke backend dengan data login
    axios.post('http://localhost:8001/login', values)
      .then(res => {
        if (res.data.Status === "Login Success") {
          // Jika login sukses, navigasikan ke halaman home
          navigate('/');
        } else {
          // Jika login gagal, tampilkan pesan kesalahan
          alert(res.data.Message);
        }
      })
      .catch(err => console.log("Login Error:", err));
  };

  // Handler untuk perubahan input
  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value // Menetapkan nilai email/password berdasarkan input
    });
  };

  return (
    <AuthForm title="Login" linkText="Don't have an account?" linkHref="/register">
      <form onSubmit={handleSubmit}>
        {/* Input email */}
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="user@email.com"
          value={values.email}
          onChange={handleInputChange}
        />
        
        {/* Input password */}
        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="********"
          value={values.password}
          onChange={handleInputChange}
        />
        
        {/* Tombol submit */}
        <Button
          type="submit"
          className="loginButton"
        >
          Login
        </Button>
      </form>
    </AuthForm>
  );
};

export default LoginForm;
