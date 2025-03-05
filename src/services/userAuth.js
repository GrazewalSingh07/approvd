import { auth } from "../firebase/firebase";

export const getCurrentUser = () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not signed in.");
    return null;
  }
  return user;
};
