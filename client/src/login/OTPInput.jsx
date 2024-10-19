import React from "react";
import { useState, useEffect, useContext } from "react";
import { RecoveryContext } from "../App";
import AuthForm from "../components/authform/authForm"; // Reusing AuthForm
import FormInput from "../components/forminput/formInput"; // For styling OTP input fields
import { Button, Container } from "react-bootstrap"; // Reusing button and container components
import axios from "axios";

const OTPInput = () => {
  const { email, otp, setPage } = useContext(RecoveryContext);
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);

  function resendOTP() {
    if (disable) return;
    axios
      .post("http://localhost:8001/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      })
      .then(() => {
        setDisable(true);
        alert("A new OTP has successfully been sent to your email.");
        setTimer(60);
      })
      .catch(console.log);
  }

  function verifyOTP() {
    if (parseInt(OTPinput.join("")) === otp) {
      setPage("reset");
      return;
    }
    alert(
      "The code you have entered is not correct, try again or re-send the link"
    );
    return;
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); // Each count lasts for a second
    return () => clearInterval(interval); // Cleanup
  }, [disable]);

  const handleOTPInputChange = (index, value) => {
    const newOTP = [...OTPinput];
    newOTP[index] = value;
    setOTPinput(newOTP);
  };

  return (
    <AuthForm
      title="Email Verification"
      linkText="Didn't receive a code?"
      linkHref=""
    >
      <form>
        <Container className="otp-container">
          <p className="text-gray-800">
            We have sent a code to your email {email}
          </p>
          <div
            className="otp-inputs"
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            {OTPinput.map((digit, index) => (
              <FormInput
                key={index}
                maxLength="1"
                className="otp-input"
                value={digit}
                onChange={(e) => handleOTPInputChange(index, e.target.value)}
                style={{ width: "50px", height: "50px", textAlign: "center" }} // Set equal width and height for each input
              />
            ))}
          </div>
          <div
            className="otp-verify-container"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button
              type="button"
              onClick={verifyOTP}
              className="otp-verify-button"
              style={{ width: "150px", textAlign: "center" }} // Optional: Set width if needed
            >
              Verify Account
            </Button>
          </div>
        </Container>

        <Container className="resend-container">
          <p className="text-gray-500">
            Didn't receive code?{" "}
            <span
              className="resend-link"
              style={{
                color: disable ? "gray" : "blue",
                cursor: disable ? "none" : "pointer",
                textDecorationLine: disable ? "none" : "underline",
              }}
              onClick={() => resendOTP()}
            >
              {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
            </span>
          </p>
        </Container>
      </form>
    </AuthForm>
  );
};

export default OTPInput;
