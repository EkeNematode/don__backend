const express = require("express");
const cloudinary = require("../middleware/storage.js");
const upload = require("../middleware/multer.js");

const router = express.Router();

const {
  createRestaurant,
  getFilteredRestaurantsByCategory,
  getRestaurantsForUsers,
  updateMealAvailability,
} = require("../controllers/restaurantController.js");
const { protect } = require("../middleware/authMiddleware.js");
const Restaurant = require("../models/restaurantModel.js");
const Auth = require("../models/authModel.js");

router.get(
  "/get-filtered-restaurant",
  protect,
  getFilteredRestaurantsByCategory
);
router.get("/get-restaurant-for-users", protect, getRestaurantsForUsers);
router.patch("/update-meal-availability", protect, updateMealAvailability);

router.post(
  "/create-restaurant",
  protect,
  upload.single("foodImage"),
  async function (req, res) {
    try {
      const { name, price, category } = await req.body;
      console.log(price);
      const user = await Auth.findById(req.user);
      if (user.role !== "vendor") {
        return res
          .status(400)
          .json({ message: "You are not authorized to create a restaurant." });
      }
      if (!name || !price || !category) {
        return res.status(400).json({ message: "Please fill in all fields." });
      }
      const foodImage = await cloudinary.uploader.upload(
        req.file.path,
        function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              message: "Error",
            });
          }

          return result;
        }
      );
      if (!foodImage) {
        return res.status(400).json("Please fill in all fields.");
      }
      const num = Number(price);
      const newRestaurant = new Restaurant({
        name,
        price: num,
        image: foodImage.secure_url,
        category,
        user,
      });
      newRestaurant.save().then((restaurant) => {
        res.json({
          user: restaurant.user,
          id: restaurant._id,
          name: restaurant.name,
          price: restaurant.price,
          category: restaurant.category,
          available: restaurant.available,
          image: restaurant.image,
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
// router.post("/login", login);

module.exports = router;
