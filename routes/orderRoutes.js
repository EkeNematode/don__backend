const express = require("express");
const {
  createOrder,
  getOrdersForVendor,
  getOrderForCLients,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.get("/get-vendor-order", protect, getOrdersForVendor);
router.get("/get-user-order", protect, getOrderForCLients);
router.patch("/update-order-status", protect, updateOrderStatus);

module.exports = router;
