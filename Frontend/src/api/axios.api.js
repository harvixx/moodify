// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 guard conditions
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") && // ❗ loop रोकता है
      !originalRequest.url.includes("/auth/login") &&   // ❗ login fail पर refresh नहीं
      !originalRequest.url.includes("/auth/register")   // ❗ register पर भी नहीं
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (err) {
        console.log("Refresh failed:", err.message);

        // 🔥 only redirect if refresh fail
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;