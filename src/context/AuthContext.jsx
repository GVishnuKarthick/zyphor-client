import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/userApi";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("zyphor_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (accessToken) => {
    localStorage.setItem("zyphor_token", accessToken);
    setToken(accessToken);

    const me = await getCurrentUser();
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem("zyphor_token");
    localStorage.removeItem("zyphor_refresh_token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (token) {
          const me = await getCurrentUser();
          setUser(me);
        }
      } catch {
        localStorage.removeItem("zyphor_token");
        localStorage.removeItem("zyphor_refresh_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}