const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: [true, "Please add a user"],
    },
    username: {
      type: String,
      required: true,
    },
    userphone: {
      type: String,
      required: true,
    },
    useruniversity: {
      type: String,
      required: true,
    },
    vendorId: {
      type: String,
      required: true,
    },
    food: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "New",
    },
    dispatchRider: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
