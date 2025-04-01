import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
// import { GoogleAuthProvider } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import instance from "../../../axios.config.js"

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      initializeUser(user);
    });
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });

      // Check provider type
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password",
      );
      setIsEmailUser(isEmail);
      const isLoggedIn = !isEmail || (isEmail && user.emailVerified);
      const token = await auth.currentUser.getIdToken()
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUserLoggedIn(isLoggedIn);
    } else {
      // No user is signed in
      setCurrentUser(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
      setIsGoogleUser(false);
    }

    setLoading(false);
  }

  // You may want to add a refresh function to manually trigger auth state checks
  const refreshAuthState = () => {
    if (auth.currentUser) {
      initializeUser(auth.currentUser);
    }
  };

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
    refreshAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
