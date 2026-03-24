// src/features/auth/context/Auth.context.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/auth.api";

const AuthContext = createContext();

const publicRoutes = ["/login", "/register", "/verify-notice", "/verify-email"];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // force=true — public route check bypass karta hai (login/verify ke baad use karo)
  const fetchUser = async (force = false) => {
    const isPublicRoute = publicRoutes.some((route) =>
      window.location.pathname.startsWith(route)
    );

    if (!force && isPublicRoute) {
      setLoading(false);
      return null;
    }

    try {
      const response = await getMe();
      if (response.success) {
        setUser(response.data);
        return response.data;
      }
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
