import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import apiService from "../services/api";
import type { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Erro ao parsear dados do usuário:", error);
          localStorage.removeItem("user");
        }
      } else if (token) {
        try {
          const response = await apiService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(response.data));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<void> => {
    try {
      const response = await apiService.login({ email, password });

      if (response.success && response.data) {
        const { user: userData, token, refreshToken } = response.data;

        setUser(userData);
        setIsAuthenticated(true);

        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));

        if (rememberMe) {
          localStorage.setItem("remember_me", "true");
        }
      } else {
        throw new Error(response.message || "Erro no login");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("remember_me");
    }
  };

  const updateUser = (newUserData: Partial<User>): void => {
    if (!user) return;
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);

    const rememberMe = localStorage.getItem("clinica_remember") === "true";
    if (rememberMe) {
      localStorage.setItem("clinica_user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("clinica_user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
