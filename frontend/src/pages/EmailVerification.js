import React, { useEffect, useState } from "react";
import { instance } from "../App";

const EmailVerification = () => {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Extract the token from the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No token provided.");
      return;
    }

    params.append('token', token);
    async function verify() {
        try {
            const response = await instance.post(`/auth/verify-email?${params.toString()}`)
            setStatus("success");
            setMessage("Email verified successfully!");
        } catch (error) {
            const errorMessage =
                error.response?.data?.detail || "Verification failed.";
            setStatus("error");
            setMessage(errorMessage);
        }
    }
    verify()
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <div>
          <h1>Email Verified!</h1>
          <p>{message}</p>
          <a href="/login">Go to Login</a>
        </div>
      )}
      {status === "error" && (
        <div>
          <h1>Verification Failed</h1>
          <p>{message}</p>
          <a href="/resend-verification">Resend Verification Email</a>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
