const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    username: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
