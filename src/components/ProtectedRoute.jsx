import { Navigate } from "react-router";
import { useAuth } from "../contexts/authContext";

export const ProtectedRoute = ({ children }) => {
  const { userLoggedIn } = useAuth();
  return userLoggedIn ? children : <Navigate to="/login" />;
};
