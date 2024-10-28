
const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const cors = require("cors")({origin: true}); // Import and use CORS middleware

const razorpay = new Razorpay({
  key_id: "rzp_test_Gg4MocF5ZN47X5",
  key_secret: "97F269sirVcVgmkEEDVFX4mk",
});

exports.createOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => { // Wrap your function inside cors()
    if (req.method !== "POST") {
      return res.status(400).json({message: "Invalid request method"});
    }

    const {amount} = req.body;

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
      res.status(500).json({error: "Failed to create Razorpay order"});
    }
  });
});

