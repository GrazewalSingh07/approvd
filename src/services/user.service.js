import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getUserData = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    return {
      displayName: user.displayName || "",
      email: user.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    };
  }
};
