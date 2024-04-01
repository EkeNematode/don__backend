const Auth = require("../models/authModel");
const Restaurant = require("../models/restaurantModel");
const expressAsyncHandler = require("express-async-handler");

// create restaurant
const createRestaurant = expressAsyncHandler(async (req, res) => {
  try {
    const { name, price, image, category, available } = await req.body;
    const user = await Auth.findById(req.user);
    console.log(user, "lk");
    if (user.role !== "vendor") {
      return res
        .status(400)
        .json({ message: "You are not authorized to create a restaurant." });
    }
    if (!name || !price || !image || !category) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    const newRestaurant = new Restaurant({
      name,
      price,
      image,
      category,
      available,
      user,
    });
    newRestaurant.save().then((restaurant) => {
      res.json({
        _id: restaurant._id,
        name: restaurant.name,
        price: restaurant.price,
        image: restaurant.image,
        category: restaurant.category,
        available: restaurant.available,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getFilteredRestaurantsByCategory = expressAsyncHandler(
  async (req, res) => {
    try {
      const restData = await Restaurant.find({ user: req.user.id });
      if (restData) {
        res.status(200).json(restData);
      } else {
        res.status(400).json({
          message: "Error occured",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
const getRestaurantsForUsers = expressAsyncHandler(async (req, res) => {
  console.log("lodhe");
  try {
    const { userId } = req.query;
    const restData = await Restaurant.find({ user: userId });
    console.log(restData, "lk");
    if (restData) {
      res.status(200).json(restData);
    } else {
      res.status(400).json({
        message: "Error occured",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//update meal availability to true or false
const updateMealAvailability = expressAsyncHandler(async (req, res) => {
  try {
    const { available, mealId } = req.query;
    console.log("mealId", mealId);
    if (!available || !mealId) {
      return res.status(400).json({ message: "Please fill in all fieldssss." });
    }
    const meal = await Restaurant.findByIdAndUpdate(
      mealId,
      { available },
      { new: true }
    );
    res.status(200).json(meal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "It's us not you" });
  }
});

module.exports = {
  createRestaurant,
  getFilteredRestaurantsByCategory,
  getRestaurantsForUsers,
  updateMealAvailability,
};
