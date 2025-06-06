import functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import "dotenv/config";
import codRoute from "./routes/cod.routes.js";
import razorpayRoute from "./routes/razorpay.routes.js";
import shiprocketRoute from "./routes/shiprocket.routes.js";
import { authenticate } from "./middlewares/auth.js";

admin.initializeApp();

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());
app.use(authenticate);

app.use("/cod", codRoute);
app.use("/razorpay", razorpayRoute);
app.use("/shiprocket", shiprocketRoute);

export const db = admin.firestore();
export const api = functions.https.onRequest(app);
