MediCloud — Cloud-Based Hospital Management System
A self-hosted cloud dashboard designed to manage hospital patients, doctors, and appointments. This project was developed for a University Cloud Computing course.

How to Run (2 Simple Commands)
Requirement: Make sure you have Node.js installed on your computer.

Open your terminal or CMD inside the project folder.

Run these two commands:

Bash
npm install
npm start
Open your browser and go to: http://localhost:3000

Login Credentials:

Username: admin

Password: admin123

Project Architecture
The system follows a standard Client-Server model:
Browser (UI) <--> Express.js Server (Node.js) <--> db.json (Data Store)

Frontend: HTML, CSS, and JavaScript (located in the public/ folder).

Backend: Node.js + Express.js (REST API).

Database: JSON file-based storage (data/db.json).

Key Features
Authentication: Role-based login system for Administrators.

Live Dashboard: View total patients, admitted cases, doctors, and daily appointments.

CRUD Modules: Full Create, Read, Update, and Delete support for Patients, Doctors, and Appointments.

Appointment Tracking: Manage statuses (Pending, Confirmed, Completed, Cancelled).

UI/UX: Fully responsive and modern interface.

Why is this a "Cloud Computing" Project?
This project implements a classic cloud model:

Centralized Server: The Node.js/Express server hosts all data and logic.

Client Access: Clients (browsers/mobile) connect to the server via REST APIs.

Remote Accessibility: Data is stored centrally, allowing multiple devices to access the system.

Deployment Options
Option A (Self-Hosting):

Configure port forwarding (port 3000) on your router.

Run npm start and keep your PC running.

Access the app from anywhere using: http://[your-public-ip]:3000

Option B (Free Cloud Hosting):

Push your project to GitHub.

Connect your repository to Render.com or Railway.app.

Use npm install as the build command and npm start to run it.

Option C (Temporary Access):

Run npm start and then use ngrok http 3000 to generate a temporary public URL.

Project Structure
Plaintext
hospital-management-system/
├── server.js              # Main server entry
├── data/db.json           # Data storage
├── routes/                # API routes
├── public/                # Frontend files (HTML/CSS/JS)
└── package.json           # Dependencies
Notes for Report
Communication: Frontend interacts with the backend via REST API (JSON).

Functionality: Full CRUD (Create, Read, Update, Delete) operations are implemented.

Security Recommendation: This is a demo-level authentication system. For production, it is recommended to use bcrypt for password hashing and JWT (JSON Web Tokens) for secure session management.
