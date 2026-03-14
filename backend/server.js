const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const studentRoutes = require("./routes/students");
const lectureRoutes = require("./routes/lectures");
const attendanceRoutes = require("./routes/attendance");

dotenv.config();

const app = express();

/* ==============================
   MIDDLEWARE
============================== */

app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* ==============================
   DATABASE CONNECTION
============================== */

connectDB();

/* ==============================
   ROUTES
============================== */

app.use("/students", studentRoutes);
app.use("/lectures", lectureRoutes);
app.use("/attendance", attendanceRoutes);

/* ==============================
   HEALTH CHECK ROUTES
============================== */

app.get("/", (req, res) => {
  res.send("AATU Attendance API Running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "API Working",
    project: "AATU Smart Attendance System"
  });
});

/* ==============================
   SERVER START
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 AATU Attendance API running on port ${PORT}`);
});