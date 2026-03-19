// src/auth/hooks/useVerifyNotice.js
import { useState } from "react";
import api from "../../../api/axios.api";

export const useVerifyNotice = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const email = localStorage.getItem("verifyEmail");

  const resendEmail = async () => {
    if (!email) {
      setMessage("No email found. Please register again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/resend-verification", { email });
      setMessage("Verification email sent again ✅");
    } catch (err) {
      setMessage("Failed to resend email ❌");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    resendEmail,
    loading,
    message,
  };
};