import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 reusable function
  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
      return res.data;
    } catch (err) {
      setUser(null);
      return null;
    }
  };

  // 🔥 initial load
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);