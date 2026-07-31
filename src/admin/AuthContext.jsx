import React, { createContext, useContext, useEffect, useState } from "react";
import { adminApi, tokenStore } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .get("/admin/me")
      .then((res) => setAdmin(res.data))
      .catch(() => {
        tokenStore.clear();
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await adminApi.post("/admin/login", { email, password });
    tokenStore.set(data.access_token);
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = () => {
    tokenStore.clear();
    setAdmin(null);
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
