const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

router.post("/", async (req, res) => {
  try {

    const { matricNumber, lectureId } = req.body;

    // find student
    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // prevent duplicate attendance
    const existing = await Attendance.findOne({
      studentId: student._id,
      lectureId: lectureId
    });

    if (existing) {
      return res.json({ message: "Attendance already recorded" });
    }

    const attendance = new Attendance({
      studentId: student._id,
      lectureId: lectureId
    });

    await attendance.save();

    res.json({
      message: "Attendance recorded successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:lectureId", async (req, res) => {
  try {

    const attendance = await Attendance.find({
      lectureId: req.params.lectureId
    }).populate("studentId");

    res.json(attendance);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;