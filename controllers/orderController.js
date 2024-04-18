const expressAsyncHandler = require("express-async-handler");
const Model = require("../models/orderModel");
const Auth = require("../models/authModel");

const createOrder = expressAsyncHandler(async (req, res) => {
  try {
    const {
      vendorId,
      food,
      total,
      username,
      userphone,
      useruniversity,
      location,
    } = req.body;
    const user = await req.user;
    console.log(vendorId);
    if (
      !vendorId ||
      !food ||
      !total ||
      !username ||
      !userphone ||
      !useruniversity ||
      !location
    ) {
      return res.status(400).json({ message: "Please fill in all fields." });
    } else {
      //update vendor account
      const vendor = await Auth.findById(vendorId);
      const vendorBalance = vendor.balance;
      const newBalance = vendorBalance + total;
      await Auth.findByIdAndUpdate(vendorId, { balance: newBalance });
      // update user account
      // const userBalance = user.balance;
      // const newUserBalance = userBalance - total;
      // await Auth.findByIdAndUpdate(user.id, { balance: newUserBalance });
      const newOrder = new Model({
        user: user.id,
        vendorId,
        food,
        total,
        username,
        userphone,
        useruniversity,
        location,
      });
      newOrder.save().then((order) => {
        res.json({
          user: order.user,
          id: order._id,
          vendorId: order.vendorId,
          food: order.food,
          total: order.total,
          username: order.username,
          userphone: order.userphone,
          useruniversity: order.useruniversity,
          location: order.location,
        });
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getOrdersForVendor = expressAsyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.query;
    if (!vendorId) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    const orders = await Model.find({
      vendorId,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "It's us not you" });
  }
});

const getOrderForCLients = expressAsyncHandler(async (req, res) => {
  try {
    const orders = await Model.find({ user: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "It's us not you" });
  }
});

//update order status
const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  console.log(req.user.id, "id");
  try {
    const userId = req.user.id;
    const { status, orderId } = req.query;
    console.log(status, orderId);
    if (!status || !orderId) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    // return user money if order is Cancelled
    const order = await Model.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (status == "Cancelled") {
      await Auth.findByIdAndUpdate(req.user.id, {
        balance: req.user.balance - order.total,
      });
      const buyer = await Auth.findById(order.user);
      console.log(buyer, "buyer");
      console.log(order.total, "tots");
      await Auth.findByIdAndUpdate(
        order.user,
        {
          balance: buyer.balance + order.total,
        },
        { new: true }
      );
    }
    console.log(order.user, "user");
    res.status(200).json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "It's us not you" });
  }
});

//update meal availability

module.exports = {
  createOrder,
  getOrdersForVendor,
  getOrderForCLients,
  updateOrderStatus,
};
