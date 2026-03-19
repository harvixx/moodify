// src/auth/hooks/useVerify.js
import { useState } from "react";
import api from "../../../api/axios.api";

export const useVerify = () => {
  const [status, setStatus] = useState("loading"); // loading | success | error

  const verifyEmail = async (token, fetchUser) => {
    try {
      setStatus("loading");

      await api.get(`/auth/verify/${token}`);

      // 🔥 email remove (cleanup)
      localStorage.removeItem("verifyEmail");

      // 🔥 auto login (cookies already set)
      if (fetchUser) {
        await fetchUser();
      }

      setStatus("success");
      return true;

    } catch (err) {
      setStatus("error");
      return false;
    }
  };

  return { verifyEmail, status };
};