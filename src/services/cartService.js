import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
 

// Function to update the cart when adding/removing items
export const updateCartItem = async (item, quantityChange) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not signed in.");
    return null;
  }

  const uid = user.uid; // Get the user's ID
  const cartRef = doc(db, "carts", uid); // Reference to the user's cart document

  try {
    // Fetch the current cart data
    const cartDoc = await getDoc(cartRef);
    if (!cartDoc.exists()) return;

    const cartItems = cartDoc.data().items;

    // Find the item in the cart and update its quantity
    const updatedItems = cartItems.map(cartItem =>
      cartItem.productId === item.productId
        ? { ...cartItem, quantity: cartItem.quantity + quantityChange }
        : cartItem
    );

    // Remove the item if its quantity is zero
    const filteredItems = updatedItems.filter(cartItem => cartItem.quantity > 0);

    // Update the cart document in Firestore
    await updateDoc(cartRef, {
      items: filteredItems,
    });
  } catch (error) {
    console.error("Error updating cart: ", error);
    throw error;
  }
};

// Function to remove item from cart
export const removeCartItem = async (item) => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not signed in.");
    return null;
  }

  const uid = user.uid; // Get the user's ID
  const cartRef = doc(db, "carts", uid); // Reference to the user's cart document

  try {
    // Fetch the current cart data
    const cartDoc = await getDoc(cartRef);
    if (!cartDoc.exists()) return;

    const cartItems = cartDoc.data().items;

    // Filter out the item to be removed
    const updatedItems = cartItems.filter(cartItem => cartItem.productId !== item.productId);

    // Update the cart document in Firestore
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
  
    const uid = user.uid; // Get the user's ID
    const cartRef = doc(db, "carts", uid); // Reference to the user's cart document
  
    try {
      const cartDoc = await getDoc(cartRef);
  
      if (cartDoc.exists()) {
        return cartDoc.data().items; // Return the cart items array
      } else {
        console.log("No cart found for the user.");
        return [];
      }
    } catch (error) {
      console.error("Error getting cart data: ", error);
      throw error;
    }
  };