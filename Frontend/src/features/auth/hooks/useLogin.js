// src/auth/hooks/useLogin.js
import { useState } from "react";
import { loginUser } from "../services/auth.api";
import { useAuth } from "../context/Auth.context";

export const useLogin = () => {
  const { fetchUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await loginUser(formData);

      // ✅ force=true — /login public route check bypass karega
      await fetchUser(true);

      return { success: true };

    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);

      if (message.toLowerCase().includes("verify")) {
        localStorage.setItem("verifyEmail", formData.email);
        return { success: false, needsVerification: true };
      }

      return { success: false };

    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};