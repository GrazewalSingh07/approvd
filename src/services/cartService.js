import { doc, setDoc, updateDoc, arrayUnion, getDoc, deleteField } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { calculateTotals } from "../utils/calculateTotals";

export const updateCart = async (data) => {
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

    await updateDoc(cartRef, { ...data });
  } catch (error) {
    console.error("Error updating cart: ", error);
    throw error;
  }
};


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

    const updatedItems = cartItems.map(cartItem =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + quantityChange }
        : cartItem
    );

    const filteredItems = updatedItems.filter(cartItem => cartItem.quantity > 0);
    const totalPrice = calculateTotals(filteredItems)?.totalPrice;

    await updateDoc(cartRef, {
      items: filteredItems,
      ...(filteredItems?.length && { totalPrice }),
      ...(filteredItems?.length === 0 && { totalPrice: deleteField() })
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
    const totalPrice = calculateTotals(cartItems)?.totalPrice;

    await updateDoc(cartRef, {
      items: updatedItems,
      ...(updatedItems?.length && { totalPrice }),
      ...(updatedItems?.length === 0 && { totalPrice: deleteField() })
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

export const addToCart = async (item) => {
  const user = auth.currentUser;
  const cartRef = doc(db, 'carts', user.uid);
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    // Update existing cart (push new item into array)
    const combinedCartItems = cartDoc.data().items.concat(item);
    const totalPrice = calculateTotals(combinedCartItems)?.totalPrice;
    await updateDoc(cartRef, {
      items: arrayUnion(item),
      totalPrice
    });
  } else {
    // Create a new cart document if it doesn't exist
    const totalPrice = calculateTotals([item])?.totalPrice;
    await setDoc(cartRef, {
      items: [item],
      totalPrice
    });
  }
} 
