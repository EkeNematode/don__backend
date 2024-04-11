const expressAsyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");

const createPayment = expressAsyncHandler(async (req, res) => {
  try {
    const { amount, username, accountNumber, bankName, accountName } = req.body;
    if (!amount || !username || !accountNumber || !bankName || !accountName) {
      return res.status(400).json({ message: "Please fill in all fields." });
    } else {
      const newPayment = new Payment({
        amount,
        username,
        accountNumber,
        bankName,
        accountName,
      });
      newPayment.save().then((payment) => {
        res.json(newPayment);
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all payments
const getPayments = expressAsyncHandler(async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all paymnet for a user
const getPaymentForUser = expressAsyncHandler(async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update payment status from pending to success
const updatePaymentStatus = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.query;
    const payment = await Payment.findById(id);
    if (payment) {
      payment.status = "Completed";
      await payment.save();
      res.json(payment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createPayment,
  getPayments,
  getPaymentForUser,
  updatePaymentStatus,
};
