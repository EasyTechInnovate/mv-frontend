import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("adminUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);

  const login = useCallback((userData, tokens) => {
    localStorage.setItem("adminUser", JSON.stringify(userData));
    localStorage.setItem("adminAccessToken", tokens.accessToken);
    localStorage.setItem("adminRefreshToken", tokens.refreshToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";
  const isTeamMember = user?.role === "team_member";
  const moduleAccess = user?.moduleAccess || [];

  // Check if user has access to a specific module
  // Admins always have full access
  const hasAccess = useCallback(
    (moduleName) => {
      if (!moduleName) return true;
      if (isAdmin) return true;
      return moduleAccess.includes(moduleName);
    },
    [isAdmin, moduleAccess]
  );

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAdmin, isTeamMember, moduleAccess, hasAccess }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
