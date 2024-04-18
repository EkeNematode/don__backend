const expressAsyncHandler = require("express-async-handler");
const University = require("../models/universityModel");

// create university
const createUniversity = expressAsyncHandler(async (req, res) => {
  try {
    const { university } = req.body;
    if (!university) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    const newUniversity = await University.create({
      university,
    });
    res.status(201).json({
      id: newUniversity._id,
      university: newUniversity.university,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get all universities
const getUniversities = expressAsyncHandler(async (req, res) => {
  try {
    const universities = await University.find();
    res.json(universities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { createUniversity, getUniversities };
