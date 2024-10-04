import React, { useState } from "react";
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import "./login.scss";
import { useAuth } from "../hooks/useAuth"; // Import the custom hook
import { useNavigate } from "react-router-dom";
import GoogleLogin from "../components/googleButton/googleButton";

const LoginForm = () => {
  const { setToken } = useAuth(); // Use the custom hook for token handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        setToken(data.token); // Store the token
        alert("Login successful");
        localStorage.setItem('email', data.email); 
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <AuthForm title="Login" linkText="Don't have an account?" linkHref="/register">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="loginButton">
          Login
        </Button>
        <GoogleLogin/>
      </form>
    </AuthForm>
  );
};

export default LoginForm;
