const express = require("express");

const router = express.Router();

const {
  createRestaurant,
  getFilteredRestaurantsByCategory,
} = require("../controllers/restaurantController.js");
const { protect } = require("../middleware/authMiddleware.js");

router.post("/create-restaurant", protect, createRestaurant);
router.get(
  "/get-filtered-restaurant",
  protect,
  getFilteredRestaurantsByCategory
);
// router.post("/login", login);

module.exports = router;
