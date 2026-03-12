# AATU Smart Attendance System

A QR-code based lecture attendance system built as a prototype for AbdulRasaq Abubakar Toyin University (AATU).

The system allows lecturers to create lecture sessions and generate QR codes that students scan to mark attendance instantly.

---

## Features

- Create lecture sessions
- Generate QR code for attendance
- Students scan QR code to mark attendance
- Prevent duplicate attendance
- View attendance reports
- Attendance statistics

---

## System Architecture

Frontend:
- HTML
- CSS
- JavaScript
- Axios

Backend:
- Node.js
- Express.js

Database:
- MongoDB Atlas

Deployment:
- Frontend → Netlify
- Backend → Render

---

## Project Structure
aatu-attendance-system
│
├── backend
│ └── Node.js API
│
├── frontend
│ └── Web interface
│
└── README.md


---

## How It Works

1. Lecturer creates a lecture session
2. System generates a QR code
3. Students scan the QR code
4. Students enter their matric number
5. Attendance is recorded in the database
6. Lecturer can view attendance reports

---

## Future Improvements

- Student authentication
- Duplicate attendance protection
- Time-limited QR codes
- GPS classroom verification
- Lecturer login system

---

## Author

Yusuf Isiaka