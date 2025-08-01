// context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useFetch } from "../Hooks_Personalizados/UseFetch";

type AuthContextType = {
  token: string | null;
  rol: number | null;
  login: (token: string, rol: number) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("tk_u"));
  const [rol, setRol] = useState<number | null>(() => {
    const stored = localStorage.getItem("u_lvl");
    return stored !== null ? parseInt(stored) : null;
  });
  const { fetchData } = useFetch();

  const login = (newToken: string, newRol: number) => {
    setToken(newToken);
    localStorage.setItem("tk_u", newToken);
    setRol(newRol);
    localStorage.setItem("u_lvl", newRol.toString());
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("tk_u");
    setRol(null);
    localStorage.removeItem("u_lvl");
    fetchData(`http://localhost:5170/api/Acceso/Logout`, 'patch', {}, token ?? undefined);
  };

  return (
    <AuthContext.Provider value={{ token, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Función que nos va a servir para pillar el token
 * @returns 
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
