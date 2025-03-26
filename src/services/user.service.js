import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getUserData = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data();
  }
};

/**
 * Updates user details in Firestore
 * @param {string} userId - The user's ID
 * @param {Object} userData - The user data to update
 * @returns {Promise<void>}
 */
export const updateUserDetails = async (userId, userData) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      ...userData,
      updatedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};
