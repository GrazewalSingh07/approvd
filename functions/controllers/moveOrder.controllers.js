import { db } from "../index.js";
import admin from "firebase-admin";
import Razorpay from "razorpay";
import { createShiprocketOrder } from "./shiprocket.controllers.js";

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

  const response = await orderRef.set({
    userId,
    items: cartData.items,
    totalPrice: cartData.totalPrice,
    paymentId,
    status: "pending",
    createdAt: admin.firestore.Timestamp.now(),
  });

  const writeTime = response._writeTime;

  const writeDate = new Date(
    writeTime._seconds * 1000 + writeTime._nanoseconds / 1000000,
  );

  console.log("Write operation completed at:", writeDate.toLocaleString());

  const orderId = orderRef.id;

  const orderData = {
    order_id: orderId,
    order_date: writeDate.toLocaleString(),
    pickup_location: "Primary",
    channel_id: "",
    comment: "Test order for debugging",
    billing_customer_name: "Naruto",
    billing_last_name: "Uzumaki",
    billing_address: "House 221B, Leaf Village",
    billing_address_2: "Near Hokage House",
    billing_city: "New Delhi",
    billing_pincode: "110002",
    billing_state: "Delhi",
    billing_country: "India",
    billing_email: "naruto@uzumaki.com",
    billing_phone: "9876543210",
    shipping_is_billing: true,
    order_items: [
      {
        name: "Kunai",
        sku: "chakra123",
        units: 10,
        selling_price: 900,
        discount: 0,
        tax: 0,
        hsn: "441122",
      },
    ],
    payment_method: "Prepaid",
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: cartData.totalPrice,
    length: 10,
    breadth: 15,
    height: 20,
    weight: 2.5,
  };

  await createShiprocketOrder(orderData);

  await clearCart(userId);
};
