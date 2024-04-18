const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  university: {
    type: String,
    required: true,
  },
});

const University = mongoose.model("University", universitySchema);

module.exports = University;
