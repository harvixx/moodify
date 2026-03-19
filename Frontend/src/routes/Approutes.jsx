// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VerifyNotice from "../features/auth/pages/VerifyNotice";
import VerifyEmail from "../features/auth/pages/verify";
import Dashboard from "../features/Home/pages/Home";

import { ProtectedRoute } from "../features/auth/components/ProtectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>

      {/* 🔓 Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-notice" element={<VerifyNotice />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* 🔐 Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 🔁 fallback */}
      <Route path="*" element={<Login />} />

    </Routes>
  );
};

export default AppRoutes;