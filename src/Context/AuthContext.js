// src/Context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    // sync if token/user changed outside
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

const login = (userData, jwtToken) => {
  const normalizedUser = {
    ...userData,
    _id: userData._id || userData.id, // ⭐ ensure _id exists
    id: userData.id || userData._id   // ⭐ ensure id exists
  };

  setUser(normalizedUser);
  setToken(jwtToken);

  localStorage.setItem("user", JSON.stringify(normalizedUser));
  localStorage.setItem("token", jwtToken);
};


  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// helper hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
