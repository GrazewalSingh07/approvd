import functions from "firebase-functions";
import Razorpay from "razorpay";
import cors from "cors";

const razorpay = new Razorpay({
  key_id: import.meta.env.VITE_RAZORPAY_TEST_KEY_ID,
  key_secret: import.meta.env.VITE_RAZORPAY_TEST_KEY_SECRET,
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
