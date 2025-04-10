import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { userProfile } from "../service/UserService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null)

  const decodeToken = useCallback((token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.role || "user"; // Default to 'user' if no role specified
    } catch (error) {
      console.error("Token decoding failed:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(decodeToken(token));
    }
    setIsLoading(false);
  }, [decodeToken]);

  useEffect(() => {
    const user = async () => {
      try {
        const response = await userProfile()

        if(response.status === 200){
          console.log(response.data);
          setUserData(response.data)
        }
        
      } catch (error) {
        
      }
    }
    user()
  },

  [])

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUserRole(decodeToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userRole,
        userData,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
