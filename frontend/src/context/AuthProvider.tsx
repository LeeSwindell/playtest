import * as React from "react";
import { authAPI } from "../api/auth";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  checkTokenValid: (time: string) => boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  expiration: string | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const checkTokenValid = (time: string) => {
  const date = new Date(time);
  const current = new Date();
  if (current > date) {
    return false;
  } else {
    return true;
  }
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<null | User>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [expiration, setExpiration] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkInvalidAndLogout = () => {
      if (expiration && !checkTokenValid(expiration)) {
        logout();
      }
    };
    checkInvalidAndLogout();
  }, [expiration]);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    const storedExpiration = localStorage.getItem("expiration");
    if (storedUser && storedToken && storedExpiration) {
      if (checkTokenValid(storedExpiration)) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      } else {
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      const { access_token, expiration } = response;
      const userInfo = { id: "0", username: username };

      setUser(userInfo);
      setAccessToken(access_token);
      setExpiration(expiration);

      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("expiration", expiration);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setExpiration(null);
    // Clear user info and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiration");
  };

  const value = {
    user,
    accessToken,
    checkTokenValid,
    login,
    logout,
    expiration,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
export type { AuthContextType };
