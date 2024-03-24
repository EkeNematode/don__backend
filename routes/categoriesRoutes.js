const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoriesForUsers,
} = require("../controllers/categoriesController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-category", protect, createCategory);
router.get("/get-categories", protect, getCategories);
router.get("/get-categories-for-users", protect, getCategoriesForUsers);

module.exports = router;
