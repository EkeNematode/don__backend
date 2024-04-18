const express = require("express");
const {
  createUniversity,
  getUniversities,
} = require("../controllers/universityContoller");

const router = express.Router();

router.post("/create-university", createUniversity);
router.get("/get-universities", getUniversities);

module.exports = router;
