import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthPayload } from "../types";

interface AuthContextType {
  token: string | null;
  user: AuthPayload | null;
  setAuth: (token: string, user: AuthPayload) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string): AuthPayload | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as AuthPayload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState<string | null>(storedToken);
  const [user, setUser] = useState<AuthPayload | null>(
    storedToken ? parseJwt(storedToken) : null
  );

  const setAuth = (newToken: string, newUser: AuthPayload) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { parseJwt };
