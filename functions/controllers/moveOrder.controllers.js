import { db } from "../index.js";
import admin from "firebase-admin";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

const clearCart = async (userId) => {
  await db.collection("carts").doc(userId).delete();
};

export const moveCartToOrders = async (userId, paymentId) => {
  const payment = await razorpay.payments.fetch(paymentId);
  if (payment.status !== "captured") {
    throw new Error("Payment not captured");
  }

  const cartRef = db.collection("carts").doc(userId);
  const cartDoc = await cartRef.get();

  if (!cartDoc.exists) {
    throw new Error("Cart not found");
  }

  const cartData = cartDoc.data();
  const orderRef = db.collection("orders").doc();

  await orderRef.set({
    userId,
    items: cartData.items,
    totalPrice: cartData.totalPrice,
    paymentId,
    status: "pending",
    createdAt: admin.firestore.Timestamp.now(),
  });

  await clearCart(userId);
};
