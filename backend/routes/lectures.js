const express = require("express");
const router = express.Router();
const Lecture = require("../models/Lecture");

// Create lecture session
router.post("/", async (req, res) => {
  try {
    const lecture = new Lecture(req.body);
    await lecture.save();

    res.json({
      message: "Lecture session created",
      lectureId: lecture._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;