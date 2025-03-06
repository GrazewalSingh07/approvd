import functions from "firebase-functions";
import admin from "firebase-admin";
import Razorpay from "razorpay";
import cors from "cors";
import 'dotenv/config';
import crypto from 'node:crypto';
import { generateReceipt } from "./utils/generateReceipt.js";

admin.initializeApp();
const db = admin.firestore();

const rzp_secret = process.env.RAZORPAY_TEST_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: rzp_secret,
});

export const createOrder = functions.https.onRequest((req, res) => {
  cors({ origin: true })(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).json({ message: "Invalid request method" });
    }

    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;

    const { amount } = req.body;

    const encodedReceipt = generateReceipt(uid)

    try {
      const options = {
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: encodedReceipt,
      };
      const order = await razorpay.orders.create(options);

      const cartRef = db.collection("carts").doc(uid);
      await cartRef.update({ payment_status: 'pending' });
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create Razorpay order" });
    }
  });
});

const clearCart = async (userId) => {
  await db.collection("carts").doc(userId).delete();
};

const moveCartToOrders = async (userId, paymentId) => {
  const payment = await razorpay.payments.fetch(paymentId);
  console.log(payment, 'payment')

  if (payment.status !== "captured") {
    throw new Error("Payment not captured. Do not process order.");
  }
  const cartRef = db.collection("carts").doc(userId);
  const cartDoc = await cartRef.get();

  if (!cartDoc.exists) {
    throw new Error("Cart not found");
  }

  const cartData = cartDoc.data();

  // Create order in Firestore
  const orderRef = db.collection("orders").doc();
  await orderRef.set({
    userId,
    items: cartData.items,
    totalPrice: cartData.totalPrice,
    paymentId,
    status: "pending",
    createdAt: admin.firestore.Timestamp.now(),
  });

  clearCart(uid)
}

export const verifyPayment = functions.https.onRequest(async (req, res) => {
  cors({ origin: true })(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).json({ message: "Invalid request method" });
    }
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;

    const { razorpay_payment_id, razorpay_signature } = req.body;
    const cartRef = db.collection('carts').doc(uid)
    const cartDoc = await cartRef.get()

    if (!cartDoc.exists) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const order_id = cartDoc.data().razorpay_order_id


    function verifySignature() {
      // Construct HMAC payload
      const payload = `${order_id}|${razorpay_payment_id}`;

      // Generate HMAC hex digest
      const generatedSignature = crypto
        .createHmac('sha256', rzp_secret)
        .update(payload)
        .digest('hex');

      // Secure comparison (prevents timing attacks)
      return crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'utf8'),
        Buffer.from(razorpay_signature, 'utf8')
      );
    }

    const isValid = verifySignature()
    if (!isValid) {
      return res.status(401).json({ message: "Invalid signature", status: 401 });
    }
    await cartRef.update({ payment_status: 'success' });
    moveCartToOrders(uid, razorpay_payment_id)
    res.status(200).json({ message: "Payment verified successfully", status: 200 });
  });
});
