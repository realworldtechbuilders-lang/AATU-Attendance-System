const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  lecturer: {
    type: String
  }
});

module.exports = mongoose.model("Lecture", lectureSchema);