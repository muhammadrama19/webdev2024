import React, { useState } from "react";
import { useContext } from "react";
import { RecoveryContext } from "../App";
import AuthForm from "../components/authform/authForm"; // Reusing AuthForm
import FormInput from "../components/forminput/formInput"; // For styling OTP input fields
import { Button, Container } from "react-bootstrap"; // Reusing button and container components

export default function Reset() {
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const { setPage, setEmail } = useContext(RecoveryContext);

  // Handler untuk perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  function changePassword() {
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setPage("recovered");
  }

  return (
    <AuthForm title="Change Password">
      <form>
        <FormInput
          label="New Password"
          type="password"
          name="password"
          placeholder="Enter new password"
          value={values.password}
          onChange={handleInputChange}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter new password"
          value={values.confirmPassword}
          onChange={handleInputChange}
        />
        <Button
          onClick={changePassword}
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Reset Password
        </Button>
      </form>
    </AuthForm>
  );
}
