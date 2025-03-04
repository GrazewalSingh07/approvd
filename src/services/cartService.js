import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";


export const updateCartItem = async (item, quantityChange) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not signed in.");
    return null;
  }

  const uid = user.uid;
  const cartRef = doc(db, "carts", uid);

  try {
    const cartDoc = await getDoc(cartRef);
    if (!cartDoc.exists()) return;

    const cartItems = cartDoc.data().items;
    console.log(cartItems, 'cartItems')

    const updatedItems = cartItems.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + quantityChange }
        : cartItem
    );

    const filteredItems = updatedItems.filter(cartItem => cartItem.quantity > 0);

    await updateDoc(cartRef, {
      items: filteredItems,
    });
  } catch (error) {
    console.error("Error updating cart: ", error);
    throw error;
  }
};

export const removeCartItem = async (item) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not signed in.");
    return null;
  }

  const uid = user.uid;
  const cartRef = doc(db, "carts", uid);

  try {
    const cartDoc = await getDoc(cartRef);
    if (!cartDoc.exists()) return;

    const cartItems = cartDoc.data().items;

    const updatedItems = cartItems.filter(cartItem => cartItem.id !== item.id);

    await updateDoc(cartRef, {
      items: updatedItems,
    });
  } catch (error) {
    console.error("Error removing item from cart: ", error);
    throw error;
  }
};
export const getCartData = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not signed in.");
    return null;
  }

  const uid = user.uid;
  const cartRef = doc(db, "carts", uid);

  try {
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      return { id: cartDoc.id, ...cartDoc.data() };
    } else {
      console.log("No cart found for the user.");
      return [];
    }
  } catch (error) {
    console.error("Error getting cart data: ", error);
    throw error;
  }
};
