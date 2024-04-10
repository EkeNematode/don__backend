const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createPayment,
  getPayments,
  getPaymentForUser,
  updatePaymentStatus,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-payment", protect, createPayment);
router.get("/get-payment", protect, getPayments);
router.get("/get-user-payment", protect, getPaymentForUser);
router.patch("/update-payment-status", protect, updatePaymentStatus);

module.exports = router;
