const express = require("express");
const cloudinary = require("../middleware/storage.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/multer.js");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  register,
  login,
  getFilteredUserByRole,
  updateBalance,
  deductBalance,
  updateVendorAvailability,
  getUser,
  logout,
} = require("../controllers/authController.js");
const Auth = require("../models/authModel.js");

router.post("/register", register);
router.post("/login", login);
router.get("/get-filtered-user", getFilteredUserByRole);
router.get("/me", protect, getUser);
router.get("/logout", protect, logout);
router.patch("/update-balance", protect, updateBalance);
router.patch("/deduct-balance", protect, deductBalance);
router.patch("/update-vendor-availability", protect, updateVendorAvailability);

router.patch(
  "/update-vendor",
  protect,
  // upload.single("restaurantMainImage"),
  upload.array("image", 2),
  async function (req, res) {
    console.log(req.files, "Lki");
    try {
      const { restaurantName } = req.body;
      const [restaurantMainImage, restaurantBackgroundImage] =
        await Promise.all([
          cloudinary.uploader.upload(req.files[0].path),
          cloudinary.uploader.upload(req.files[1].path),
        ]);
      const user = req.user;
      const restaurantData = {
        restaurantName,
        restaurantBackgroundImage: restaurantBackgroundImage.secure_url,
        restaurantMainImage: restaurantMainImage.secure_url,
      };
      const updateImage = await Auth.findByIdAndUpdate(
        user.id,
        restaurantData,
        { new: true }
      );
      if (updateImage) {
        res.status(200).json({
          id: updateImage._id,
          email: updateImage.email,
          username: updateImage.username,
          phone: updateImage.phone,
          role: updateImage.role,
          university: updateImage.university,
          balance: updateImage.balance,
          available: updateImage.available,
          restaurantName: updateImage.restaurantName,
          restaurantMainImage: updateImage.restaurantMainImage,
          restaurantBackgroundImage: updateImage.restaurantBackgroundImage,
          token: generateToken(updateImage._id),
        });
      } else {
        res.status(400).json({
          message: "Error occured",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = router;
