import express from "express";
import { trackShiprocketShipment } from "../controllers/shiprocket.controllers.js";

const router = express.Router();

router.post("/track-order/:id", trackShiprocketShipment);

export default router;
