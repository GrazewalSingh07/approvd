import express from "express";
import { createCODOrder } from "../controllers/cod.controllers.js";

const router = express.Router();

router.post("/create-order", createCODOrder);

export default router;
