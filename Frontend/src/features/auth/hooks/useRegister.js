// src/auth/hooks/useRegister.js
import { useState } from "react";
import { registerUser } from "../services/auth.api";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await registerUser(formData);

      localStorage.setItem("verifyEmail", formData.email);

      return { success: true, needsVerification: true };

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        "Registration failed";

      setError(message);
      return { success: false };

    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};