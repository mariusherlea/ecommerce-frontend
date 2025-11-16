//context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  shippingAddress?: string | null;
   stripeCustomerId?: string;
};

type AuthContextType = {
  user: User | null;
  jwt: string | null;
  login: (user: User, jwt: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedJwt = localStorage.getItem("jwt");

    if (savedUser && savedJwt) {
      setUser(JSON.parse(savedUser));
      setJwt(savedJwt);
    }

    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("jwt", token);

    setUser(userData);
    setJwt(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");

    setUser(null);
    setJwt(null);
  };

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
