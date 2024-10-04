import React, { useState } from 'react';
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
import { Button } from "react-bootstrap";
import "./register.scss";
import { useAuth } from "../hooks/useAuth"; // Import the custom hook
import GoogleLogin from "../components/googleButton/googleButton"; // Import the GoogleLogin component

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role] = useState("User"); // Default role is 'User'
  const { setToken } = useAuth(); // Destructure the setToken function from the hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });
  
      const text = await response.text(); // Get the response as text first
      console.log('Response text:', text); // Log the raw response
  
      const data = JSON.parse(text); // Now parse it as JSON
      if (response.ok) {
        alert('Registration successful');
        if (data.token) {
          setToken(data.token);
        }
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <AuthForm title="Sign up" linkText="Already have an account?" linkHref="/login">
      <form onSubmit={handleSubmit}>
        <FormInput 
          label="Username" 
          type="text" 
          placeholder="your username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <FormInput 
          label="Confirm Password" 
          type="password" 
          placeholder="********" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" className="registerButton">
          Register
        </Button>
      </form>
      {/* Google Login Button */}
      <GoogleLogin />
    </AuthForm>
  );
};

export default RegisterForm;
