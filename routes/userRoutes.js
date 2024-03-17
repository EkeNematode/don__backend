const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getFilteredUserByRole,
} = require("../controllers/authController.js");

router.post("/register", register);
router.post("/login", login);
router.get("/get-filtered-user", getFilteredUserByRole);

module.exports = router;
