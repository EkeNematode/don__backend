const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orders: [
      {
        restaurantFood: [
          {
            restaurant: { type: mongoose.Types.ObjectId, ref: "Restaurant" },
            quantity: Number,
          },
        ],
      },
    ],
    amountToPay: Number,
    completed: { type: Boolean, default: false },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "assigned", "completed", "cancelled"],
    },
    user: {
      name: String,
      phoneNumber: String,
      hostelAddress: String,
    },
    deliveryPerson: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
