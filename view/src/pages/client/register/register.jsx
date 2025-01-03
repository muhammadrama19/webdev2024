import React, { useState } from "react";
import AuthForm from "../../../components/authform/authForm";
import FormInput from "../../../components/forminput/formInput";
import { Button } from "react-bootstrap";
import GoogleLogin from "../../../components/googleButton/googleButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.scss";
import Swal from "sweetalert2";

const  apiUrl = process.env.REACT_APP_API_URL;

const RegisterForm = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(""); // For email confirmation message

  const navigate = useNavigate();

  // Handle input change untuk memperbarui state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Reset error secara spesifik saat pengguna mengetik
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
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
      axios
        .post(`${apiUrl}/register`, values)
        .then((res) => {
          console.log("Response from server:", res.data);
          if (res.data.success) {
            // Show the email confirmation message instead of navigating
            setConfirmationMessage(
              "Registration successful. Please check your email to confirm your account."
            );
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Registration successful. Please check your email to confirm your account.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.data.message,
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.data.message,
          });
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
      Swal.fire("Error", "Password is required", "error");
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      Swal.fire("Error", "Password must be at least 8 characters", "error");
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = "Password must contain at least one uppercase letter";
      Swal.fire(
        "Error",
        "Password must contain at least one uppercase letter",
        "error"
      );
    } else if (!/[a-z]/.test(values.password)) {
      errors.password = "Password must contain at least one lowercase letter";
      Swal.fire(
        "Error",
        "Password must contain at least one lowercase letter",
        "error"
      );  
    } else if (!/[0-9]/.test(values.password)) {
      errors.password = "Password must contain at least one number";
      Swal.fire(
        "Error",
        "Password must contain at least one number",
        "error"
      );
    } else if (!/[!@#$%^&*]/.test(values.password)) {
      errors.password = "Password must contain at least one special character";
      Swal.fire(
        "Error",
        "Password must contain at least one special character",
        "error"
      );
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
      Swal.fire("Error", "Passwords do not match", "error");
    }

    return errors;
  };

  return (
    <div className="register">
      <AuthForm
        title="Sign up"
        linkText="Already have an account?"
        linkHref="/login"
        style={{ marginTop: "50px" }}
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
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <Button
            type="submit"
            className="registerButton"
            disabled={isSubmitting}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>

          <GoogleLogin label={"Register with Google"} />
        </form>

        {confirmationMessage && (
          <p className="confirmation-message">{confirmationMessage}</p>
        )}
      </AuthForm>
    </div>
  );
};

export default RegisterForm;
