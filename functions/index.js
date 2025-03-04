import functions from "firebase-functions";
import Razorpay from "razorpay";
import cors from "cors";
import 'dotenv/config';
import crypto from 'node:crypto';


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

    const { amount } = req.body;

    try {
      const options = {
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: "order_rcptid_11",
      };
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create Razorpay order" });
    }
  });
});

export const verifyPayment = functions.https.onRequest(async (req, res) => {
  cors({ origin: true })(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).json({ message: "Invalid request method" });
    }
    const { razorpay_payment_id, razorpay_signature } = req.body;
    // order id need to be fetched from the database
    const orderId = 'order_rcptid_11'

    function verifySignature() {
      // Construct HMAC payload
      const payload = `${orderId}|${razorpay_payment_id}`;

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
    res.status(200).json({ message: "Payment verified successfully", status: 200 });
  });
});
