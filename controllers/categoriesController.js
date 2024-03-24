const expressAsyncHandler = require("express-async-handler");
const Category = require("../models/categoriesModel");
const Auth = require("../models/authModel");

// create category
const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { category } = req.body;
    const user = await req.user;
    console.log(user, "lk");
    if (user.role !== "vendor") {
      return res
        .status(400)
        .json({ message: "You are not authorized to create a category." });
    }

    //find if user has that particular category
    const userCategory = await Category.findOne({
      category,
      user: req.user.id,
    });
    if (userCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }
    if (!category) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    const newCategory = await Category.create({
      category,
      user: req.user.id,
    });
    res.status(201).json({
      user: newCategory.user,
      id: newCategory._id,
      category: newCategory.category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all categories for a restaurant
const getCategories = expressAsyncHandler(async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const categories = await Category.find({ restaurant: restaurantId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getCategoriesForUsers = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
    const restData = await Category.find({ user: userId });
    console.log(restData, "lk");
    if (restData) {
      res.status(200).json(restData);
    } else {
      res.status(400).json({
        message: "Error occured",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { createCategory, getCategories, getCategoriesForUsers };
