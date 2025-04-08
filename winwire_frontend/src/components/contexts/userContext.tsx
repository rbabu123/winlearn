import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthState {
  username: string;
  userID: number;
  isAdmin: boolean;
  isManager: boolean;
  token: string | null;
  viewMode: "admin" | "manager" | "learner" | "";
  setAuthDetails: (details: Partial<AuthState>) => void;
  logout: () => void;
  resetViewMode: () => void;
}

const defaultAuthState: AuthState = {
  username: "",
  userID: 0,
  isAdmin: false,
  isManager: false,
  token: null,
  viewMode: "",
  setAuthDetails: () => {},
  logout: () => {},
  resetViewMode: () => {},
};

const AuthContext = createContext<AuthState>(defaultAuthState);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authDetails, setAuthDetails] = useState<AuthState>(defaultAuthState);

  // Restore from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem("authData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setAuthDetails(parsedData);
    }
  }, []);

  const updateAuthDetails = (details: Partial<AuthState>) => {
    const updatedDetails = { ...authDetails, ...details };

    if (details.isAdmin) {
      updatedDetails.viewMode = "admin";
    } else if (details.isManager) {
      updatedDetails.viewMode = "manager";
    }

    setAuthDetails(updatedDetails);
    localStorage.setItem("authData", JSON.stringify(updatedDetails)); // Persist to localStorage
  };

  const logout = () => {
    setAuthDetails(defaultAuthState);
    localStorage.removeItem("authData"); // Clear storage on logout
  };

  const resetViewMode = () => {
    setAuthDetails((prev) => ({ ...prev, viewMode: "" }));
  };

  return (
    <AuthContext.Provider value={{ ...authDetails, setAuthDetails: updateAuthDetails, logout, resetViewMode }}>
      {children}
    </AuthContext.Provider>
  );
};
