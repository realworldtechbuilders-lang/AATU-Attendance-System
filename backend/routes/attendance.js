const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");


/* ==============================
   MARK ATTENDANCE
============================== */

router.post("/", async (req, res) => {

  try {

    const { matricNumber, lectureId } = req.body;

    // Validate request
    if (!matricNumber || !lectureId) {
      return res.status(400).json({
        message: "Matric number and lectureId are required"
      });
    }

    // Find student
    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Prevent duplicate attendance
    const existing = await Attendance.findOne({
      studentId: student._id,
      lectureId: lectureId
    });

    if (existing) {
      return res.status(409).json({
        message: "Attendance already recorded"
      });
    }

    // Save attendance
    const attendance = new Attendance({
      studentId: student._id,
      lectureId: lectureId
    });

    await attendance.save();

    res.json({
      message: "Attendance recorded successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


/* ==============================
   GET ATTENDANCE REPORT
============================== */

router.get("/:lectureId", async (req, res) => {

  try {

    const attendance = await Attendance.find({
      lectureId: req.params.lectureId
    }).populate("studentId");

    res.json(attendance);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


module.exports = router;