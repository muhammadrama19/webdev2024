import React, { useState } from 'react';
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./register.scss";

const RegisterForm = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();

  // Handle input change untuk memperbarui state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value 
    });

    // Reset error secara spesifik saat pengguna mengetik
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Fungsi untuk submit form dan mengirim data ke backend
  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    // Jika tidak ada error, kirim data ke backend
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setIsLoading(true);

      // Kirim data ke backend jika validasi berhasil
      axios.post('http://localhost:8001/register', values)
        .then(res => {
          console.log('Response from server:', res.data);
          if (res.data.success) {
            navigate('/login');
          } else {
            alert(res.data.message);
          }
        })
        .catch(err => {
          console.error("Error during registration:", err);
          alert("An error occurred during registration.");
        })
        .finally(() => {
          setIsSubmitting(false); // Mencegah submit ulang
          setIsLoading(false);
        });
    }
  };

  // Fungsi validasi sederhana
  const validateForm = (values) => {
    let errors = {};

    if (!values.username.trim()) {
      errors.username = "Username is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  return (
    <AuthForm
      title="Sign up"
      linkText="Already have an account?"
      linkHref="/login"
    >
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Username"
          type="text"
          name="username"
          placeholder="Your username"
          value={values.username}
          onChange={handleInputChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}
        
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="user@email.com"
          value={values.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
        
        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="********"
          value={values.password}
          onChange={handleInputChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}
        
        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="********"
          value={values.confirmPassword}
          onChange={handleInputChange}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <Button type="submit" className="registerButton" disabled={isSubmitting}>
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </AuthForm>
  );
};

export default RegisterForm;
