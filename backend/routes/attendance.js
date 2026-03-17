const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Lecture = require("../models/Lecture");
const PDFDocument = require("pdfkit");


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
   EXAM ELIGIBILITY
============================== */

router.get("/eligibility/:courseCode", async (req, res) => {

  try {

    const courseCode = req.params.courseCode;

    // find lectures for this course
    const lectures = await Lecture.find({ courseCode });

    const lectureIds = lectures.map(l => l._id);

    const totalLectures = lectures.length;

    const students = await Student.find();

    const results = [];

    for (let student of students) {

      // count attendance only for this course
      const attendanceCount = await Attendance.countDocuments({
        studentId: student._id,
        lectureId: { $in: lectureIds }
      });

      const percentage = totalLectures === 0
        ? 0
        : Math.round((attendanceCount / totalLectures) * 100);

      const eligible = percentage >= 75;

      results.push({
        name: student.name,
        matricNumber: student.matricNumber,
        attended: attendanceCount,
        totalLectures,
        percentage,
        eligible
      });

    }

    res.json(results);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ==============================
   ELIGIBILITY PDF
============================== */

router.get("/eligibility-pdf/:courseCode", async (req, res) => {

  const courseCode = req.params.courseCode;

  const lectures = await Lecture.find({ courseCode });

  const lectureIds = lectures.map(l => l._id);

  const totalLectures = lectures.length;

  const students = await Student.find();

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(18).text(`${courseCode} Exam Eligibility List`, {
    align: "center"
  });

  doc.moveDown();

  for (let student of students) {

    const attendanceCount = await Attendance.countDocuments({
      studentId: student._id,
      lectureId: { $in: lectureIds }
    });

    const percentage = totalLectures === 0
      ? 0
      : Math.round((attendanceCount / totalLectures) * 100);

    const eligible = percentage >= 75 ? "Eligible" : "Not Eligible";

    doc.text(
      `${student.name} - ${student.matricNumber} - ${percentage}% - ${eligible}`
    );

  }

  doc.end();

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