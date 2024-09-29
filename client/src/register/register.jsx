// import React from 'react';
import AuthForm from "../components/authform/authForm";
import FormInput from "../components/forminput/formInput";
// import SubmitButton from '../components/submitbutton/submitButton';
import "./register.scss";

import { Button, Container } from "react-bootstrap";

const RegisterForm = () => {
  return (
    
      <AuthForm
        title="Sign up"
        linkText="Already have an account?"
        linkHref="/login"
      >
        <FormInput label="Email" type="email" placeholder="user@email.com" />
        <FormInput label="Password" type="password" placeholder="********" />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="********"
        />
        <Button
          className="registerButton"
        >
          Register
        </Button>
      </AuthForm>

  );
};

export default RegisterForm;
