import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useReducer,
  useMemo,
} from "react";

// Define the type for the context value
type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  user:
    | {
        id: number;
        lastName: string;
        firstName: string;
        email: string;
        role: string;
      }
    | {};
  error: string | null;
  accessToken: string | null;
};

type AuthContextState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  user:
    | {
        id: number;
        lastName: string;
        firstName: string;
        email: string;
        role: string;
      }
    | {};
  error: string | null;
  isLoading: boolean;
};

// initial state
const initialState = {
  error: null,
  isLoading: false,
  isAuthenticated: false,
  user: {},
  accessToken: null,
};

// reducer
function reducer(
  state: AuthContextState,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case "signin":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };

    case "signout":
      return initialState;

    case "loading":
      return initialState;

    case "error":
      return { ...state, error: action.payload };

    default:
      throw new Error("Unknown action");
  }
}

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
  const [{ user, isAuthenticated, isLoading, error, accessToken }, dispatch] =
    useReducer(reducer, initialState);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "loading" });

      const response = await fetch("http://localhost:5000/api/v1/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email,
        }),
      });

      const data = await response.json();

      if (data.status === "fail") {
        return dispatch({ type: "error", payload: data.message });
      }

      dispatch({ type: "signin", payload: { ...data.data } });
    } catch (err: any) {
      dispatch({ type: "error", payload: err.message });
    }
  };

  const logout = () => {
    dispatch({ type: "signout" });
  };

  const authContextValue: AuthContextType = useMemo(() => {
    return {
      isAuthenticated,
      login,
      logout,
      user,
      isLoading,
      error,
      accessToken,
    };
  }, [isAuthenticated, user, isLoading, error, accessToken]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
