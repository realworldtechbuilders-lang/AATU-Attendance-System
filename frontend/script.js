/*
========================================
AATU Smart Attendance System
Frontend Script
Handles:
1. Lecture creation
2. QR code generation
3. Student attendance marking
4. Attendance report display
========================================
*/

/* ==============================
   CONFIGURATION
   ============================== */

// Backend API URL (replace when deployed)
const API = "YOUR_BACKEND_URL";

// Stores the current lecture session
let currentLectureId = null;


/* ==============================
   CREATE LECTURE SESSION
   ============================== */

async function createLecture() {

  try {

    // Get input values
    const courseCode = document.getElementById("courseCode").value;
    const date = document.getElementById("date").value;

    // Basic validation
    if (!courseCode || !date) {
      alert("Please enter course code and date");
      return;
    }

    // Send request to backend
    const res = await axios.post(`${API}/lectures`, {
      courseCode,
      date,
      lecturer: "Demo Lecturer"
    });

    // Save lectureId returned by backend
    currentLectureId = res.data.lectureId;

    // Generate QR code for students
    generateQR(currentLectureId);

  } catch (error) {

    console.error("Error creating lecture:", error);
    alert("Failed to create lecture session");

  }

}


/* ==============================
   GENERATE QR CODE
   ============================== */

function generateQR(lectureId) {

  // URL students will visit when they scan the QR
  const url = `https://pronavy-neymar-untumidly.ngrok-free.dev/scan.html?lectureId=${lectureId}`;

  QRCode.toCanvas(
    document.getElementById("qrcode"),
    url,
    function (error) {

      if (error) {
        console.error("QR Code generation error:", error);
      }

    }
  );

}


/* ==============================
   HELPER: GET LECTURE ID FROM URL
   ============================== */

function getLectureId() {

  const params = new URLSearchParams(window.location.search);
  return params.get("lectureId");

}


/* ==============================
   MARK STUDENT ATTENDANCE
   ============================== */

async function markAttendance() {

  try {

    const matricNumber = document.getElementById("matricNumber").value;
    const lectureId = getLectureId();

    if (!matricNumber) {
      alert("Please enter your matric number");
      return;
    }

    const res = await axios.post(`${API}/attendance`, {
      matricNumber,
      lectureId
    });

    // Show server response
    document.getElementById("message").innerText = res.data.message;

  } catch (error) {

    console.error("Attendance error:", error);

    document.getElementById("message").innerText =
      "Error recording attendance";

  }

}


/* ==============================
   VIEW ATTENDANCE REPORT
   ============================== */

function viewReport() {

  // Ensure lecture exists before opening report
  if (!currentLectureId) {

    alert("Create a lecture session first");
    return;

  }

  // Redirect to report page
  window.location.href = `report.html?lectureId=${currentLectureId}`;

}


/* ==============================
   LOAD REPORT DATA
   ============================== */

async function loadReport() {

  try {

    const lectureId = getLectureId();

    const res = await axios.get(`${API}/attendance/${lectureId}`);

    const data = res.data;

    const table = document.getElementById("tableBody");

    table.innerHTML = "";

    // Populate attendance table
    data.forEach(record => {

      const student = record.studentId;

      table.innerHTML += `
        <tr>
          <td>${student.name}</td>
          <td>${student.matricNumber}</td>
          <td>Present</td>
        </tr>
      `;

    });

    // Calculate statistics
    calculateStats(data);

  } catch (error) {

    console.error("Report loading error:", error);

  }

}


/* ==============================
   CALCULATE ATTENDANCE STATS
   ============================== */

function calculateStats(data) {

  // Demo value (in real system this comes from database)
  const totalStudents = 5;

  const present = data.length;
  const absent = totalStudents - present;

  const rate = Math.round((present / totalStudents) * 100);

  document.getElementById("stats").innerText =
    `Total Students: ${totalStudents} | Present: ${present} | Absent: ${absent} | Attendance Rate: ${rate}%`;

}


/* ==============================
   AUTO LOAD REPORT PAGE
   ============================== */

if (window.location.pathname.includes("report.html")) {

  loadReport();

}