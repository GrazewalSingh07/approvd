import { generateReceipt } from "../utils/generateReceipt.js";
import { moveCartToOrders } from "./moveOrder.controllers.js";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import { db } from "../index.js";

const rzp_secret = process.env.RAZORPAY_TEST_KEY_SECRET;
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: rzp_secret,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { uid } = req.user;
    const { amount } = req.body;

    const encodedReceipt = generateReceipt(uid);
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: encodedReceipt,
    };

    const order = await razorpay.orders.create(options);
    const cartRef = db.collection("carts").doc(uid);
    await cartRef.update({ payment_status: "pending" });

    res.status(200).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { uid } = req.user;
    const { razorpay_payment_id, razorpay_signature } = req.body;
    const cartRef = db.collection("carts").doc(uid);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const order_id = cartDoc.data().razorpay_order_id;

    // Signature verification
    const payload = `${order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", rzp_secret)
      .update(payload)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "utf8"),
        Buffer.from(razorpay_signature, "utf8"),
      )
    ) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    await cartRef.update({ payment_status: "success" });
    await moveCartToOrders(uid, razorpay_payment_id);

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};
