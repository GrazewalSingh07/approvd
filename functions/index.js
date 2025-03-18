import functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import 'dotenv/config';
import razorpayRoute from "./routes/razorpay.routes.js";
import { authenticate } from "./middlewares/auth.js";

admin.initializeApp();

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());
app.use(authenticate);

app.use('/razorpay', razorpayRoute);

export const db = admin.firestore();
export const api = functions.https.onRequest(app);
