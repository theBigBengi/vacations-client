import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import config from "../config";

// Define the type for the 'User' object
interface User {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  role: string;
}

// Define the type for the context value
type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  cleanError: () => void;
  error: string | null;
  isAdmin: boolean;
  user: User | null;
};

// Create the AuthContext with the specified type
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the AuthContext in components
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// AuthProvider component
type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const body = JSON.stringify({
        password,
        email,
      });

      const response = await fetch(`${config.API_BASE_URL}/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const responseData = await response.json();

      if (responseData.status !== "fail") {
        setIsAuthenticated(true);
        setUser(responseData.data.user);
      }

      return responseData;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${config.API_BASE_URL}/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          password,
          email,
        }),
      });

      const responseData = await response.json();

      if (responseData.status !== "fail") {
        setIsAuthenticated(true);
        setUser(responseData.data.user);
      }

      return responseData;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      setIsAuthenticated(false);
      setUser(null);

      await fetch(`${config.API_BASE_URL}/auth/signout`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const authContextValue: AuthContextType = useMemo(() => {
    return {
      isAuthenticated,
      login,
      logout,
      user,
      isLoading,
      error,
      signup,
      isAdmin,
      cleanError: () => setError(null),
    };
  }, [isAdmin, isAuthenticated, user, isLoading, error]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
