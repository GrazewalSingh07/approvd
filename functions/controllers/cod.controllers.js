import { moveCartToOrders } from "./moveOrder.controllers.js";

export const createCODOrder = async (req, res) => {
  try {
    const { uid } = req.user;
    await moveCartToOrders(uid);
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
