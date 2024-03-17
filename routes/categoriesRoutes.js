const express = require("express");
const {
  createCategory,
  getCategories,
} = require("../controllers/categoriesController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-category", protect, createCategory);
router.get("/get-categories", protect, getCategories);

module.exports = router;
