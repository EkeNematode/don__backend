const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    university: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: String,
    },
    restaurantBackgroundImage: {
      type: String,
      // default: "",
    },
    restaurantMainImage: {
      type: String,
      // default: "",
    },
    restaurantName: {
      type: String,
      // default: "",
    },
    available: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
