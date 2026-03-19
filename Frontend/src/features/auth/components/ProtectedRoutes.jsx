// src/auth/components/ProtectedRoute.jsx
import { useAuth } from "../context/Auth.context";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 🔥 wait for auth check
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 🔥 not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};