import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  additionalData = {},
) => {
  try {
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Add user information to Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      ...additionalData, // Additional data like name, profile picture, etc.
    });

    return user;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const doCreateUserWithNumberAndPassword = async (
  phoneNumber,
  password,
) => {
  try {
    const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: async (response) => {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier,
        );
      },
    });
    return confirmationResult;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    // console.log(userDoc);
    if (userDoc.exists()) {
      // Return the user data along with authentication info
      return { user, ...userDoc.data() };
    } else {
      // console.error("No user data found in Firestore for this user");
      return { error: true, message: "No user data found." };
    }
  } catch (error) {
    return { error: true, message: "Invalid credetials" };
  }
};

export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
  } catch (error) {
    console.log(error);
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
