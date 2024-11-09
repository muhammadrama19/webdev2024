import { useState, useEffect } from "react";


export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Function to store the token in both state and localStorage
  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  // Function to remove token on logout
  const clearToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Check if the user is authenticated
  const isAuthenticated = () => !!token;

  return {
    setToken: saveToken,
    token,
    clearToken,
    isAuthenticated,
  };
};
