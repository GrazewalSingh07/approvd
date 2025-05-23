import { db } from "../index.js";
import admin from "firebase-admin";
import Razorpay from "razorpay";
import { createShiprocketOrder } from "./shiprocket.controllers.js";
import { format } from "date-fns";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

const clearCart = async (userId) => {
  await db.collection("carts").doc(userId).delete();
};

export const moveCartToOrders = async (userId, paymentId) => {
  if (paymentId) {
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.status !== "captured") {
      throw new Error("Payment not captured");
    }
  }

  const cartRef = db.collection("carts").doc(userId);
  const cartDoc = await cartRef.get();

  if (!cartDoc.exists) {
    throw new Error("Cart not found");
  }

  const cartData = cartDoc.data();
  const orderRef = db.collection("orders").doc();

  const payment_method = paymentId ? "Prepaid" : "COD";

  const orderDetails = {
    userId,
    items: cartData.items,
    totalPrice: cartData.totalPrice,
    payment_method,
    status: "pending",
    createdAt: admin.firestore.Timestamp.now(),
  };

  if (paymentId) {
    orderDetails["paymentId"] = paymentId;
  }

  const response = await orderRef.set(orderDetails);

  const writeTime = response._writeTime;

  const writeDate = new Date(
    writeTime._seconds * 1000 + writeTime._nanoseconds / 1000000,
  );

  const formattedOrderDate = format(writeDate, "yyyy-MM-dd");

  const orderId = orderRef.id;
  // modify the order for the shipping data
  const order_items = cartData.items.map((item) => ({
    name: item.name,
    sku: `APR-${item.id}`,
    units: item.quantity,
    selling_price: item.price,
    discount: 0,
    tax: 0,
  }));

  const totalDimensions = cartData.items.reduce(
    (acc, i) => {
      if (i.dimensions) {
        acc.dimensions["length"] = Math.max(
          acc.dimensions["length"],
          i.dimensions["length"],
        );
        acc.dimensions["breadth"] = Math.max(
          acc.dimensions["breadth"],
          i.dimensions["breadth"],
        );
        acc.dimensions["height"] = Math.max(
          acc.dimensions["height"],
          i.dimensions["height"],
        );
        acc.dimensions["weight"] += i.dimensions["weight"];
      }
      return acc;
    },
    { dimensions: { length: 0, breadth: 0, height: 0, weight: 0 } },
  );

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  const userData = userDoc.data();

  const orderData = {
    order_id: orderId,
    order_date: formattedOrderDate,
    pickup_location: "Primary",
    comment: "Test order for debugging",
    billing_customer_name: userData.billing_customer_name,
    billing_last_name: userData.billing_last_name,
    billing_address: userData.billing_address,
    billing_address_2: userData.billing_address_2,
    billing_city: userData.billing_city,
    billing_pincode: userData.billing_pincode,
    billing_state: userData.billing_state,
    billing_country: userData.billing_country,
    billing_email: userData.billing_email,
    billing_phone: userData.billing_phone,
    shipping_is_billing: true,
    order_items,
    payment_method,
    sub_total: cartData.totalPrice,
    ...totalDimensions.dimensions,
  };

  await createShiprocketOrder(orderData);

  await clearCart(userId);
};
