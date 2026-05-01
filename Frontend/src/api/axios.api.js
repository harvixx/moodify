// src/api/axios.api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api",
  withCredentials: true,
  timeout: 10000,
});

// ✅ Helper: Check if we're already on login page
const isOnLoginPage = () => window.location.pathname === "/login";

// ✅ Helper: Redirect only if not already on login

let isRefreshing = false;           // ✅ Prevent multiple simultaneous refresh calls
let failedQueue = [];               // ✅ Queue requests that came in during refresh

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Guard: network error or timeout has no config/response
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (originalRequest.url.includes("/auth/refresh")) {
      if (!isOnLoginPage()) window.location.replace("/login");
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        if (!isOnLoginPage()) window.location.replace("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;