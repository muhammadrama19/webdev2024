import React from 'react';
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
// import SubmitButton from '../SubmitButton/SubmitButton';
import "./login.scss";

import { Button, Container } from "react-bootstrap";

const LoginForm = () => {
  return (
    <AuthForm title="Login" linkText="Don't have an account?" linkHref="/register">
      <FormInput label="Email" type="email" placeholder="user@email.com" />
      <FormInput label="Password" type="password" placeholder="********" />
      <Button
          className="loginButton"
        >
          Login
        </Button>
    </AuthForm>
  );
};

export default LoginForm;
