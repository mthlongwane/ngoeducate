import { useState, useEffect, useContext, createContext } from "react";
import { checkLogin, ckeckRegister } from "./Api";
import jwtDecode from "jwt-decode";

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onSuccessfullLogin = (token, decoded) => {
    localStorage.setItem("authToken", token);
    setUser({ username: decoded.username });
    setIsAuthenticating(false);
    setIsAuthenticated(true);
  };

  const login = (mobile, countryCode, password, onSuccess, onError) => {
    checkLogin(
      {
        username: mobile,
        countryCode: countryCode,
        password: password,
      },
      (token, decoded) => {
        onSuccessfullLogin(token, decoded);
        onSuccess && onSuccess();
      },
      onError
    );
  };
  const register = (
    name,
    email,
    mobile,
    countryCode,
    password,
    onSuccess,
    onError
  ) => {
    ckeckRegister(
      {
        name: name,
        email: email,
        mobile: mobile,
        countryCode: countryCode,
        password: password,
      },
      () => {
        onSuccess && onSuccess();
      },
      onError
    );
  };

  const logout = () => {
    setUser(false);
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setIsAuthenticating(false);
  };

  useEffect(() => {
    let token = localStorage.getItem("authToken");
    if (token) {
      setUser(jwtDecode(token));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticating(false);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    isAuthenticating,
  };
}
