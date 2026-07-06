# MediCloud &mdash; Cloud-Based Hospital Management System

Ek self-hosted cloud dashboard jo hospital ke patients, doctors aur appointments manage karta hai.
University cloud computing project ke liye banaya gaya hai.

## Kaise Run Karein (2 commands)

Requirement: **Node.js** installed hona chahiye (nodejs.org se download karain agar nahi hai).

Project folder ke andar terminal/CMD kholain aur ye 2 commands chalayen:

```
npm install
npm start
```

Phir browser mein ye link kholain:

```
http://localhost:3000
```

**Login credentials:**
- Username: `admin`
- Password: `admin123`

Bas! Poora system chal jaye ga &mdash; login, dashboard, patients, doctors, appointments sab kuch.

## Project Kaise Kaam Karta Hai (Architecture)

```
Browser (UI)  <-->  Express.js Server (Node.js)  <-->  db.json (Cloud data store)
```

- **Frontend**: HTML, CSS, JavaScript (public/ folder) &mdash; login page aur dashboard
- **Backend**: Node.js + Express.js (server.js aur routes/ folder) &mdash; REST API
- **Database**: JSON file-based store (data/db.json) &mdash; server ke through hi access hota hai, seedha file access allowed nahi

## Features

- Secure-style login system (role-based: Administrator)
- Dashboard with live stats (total patients, admitted, doctors, today's appointments)
- Patients module: Add / Edit / Delete / View
- Doctors module: Add / Edit / Delete / View
- Appointments module: Add / Edit / Delete / View, with status tracking (Pending/Confirmed/Completed/Cancelled)
- Fully responsive, modern UI

## Ye "Cloud Computing" Project Kyun Hai

Ye project client-server cloud model follow karta hai:
1. **Server** (Node.js/Express) data aur logic host karta hai
2. **Clients** (browser, mobile) us server se REST API ke zariye connect hotay hain
3. Data centrally ek jagah store hota hai, jahan se kayi devices access kar saktay hain

### Actual Cloud Par Deploy Karne Ke Liye (Optional, extra marks ke liye)

Is project ko real cloud par deploy karne ke 3 tareeqay hain:

**Option A &mdash; Apna PC hi cloud server banayen** (jaisa pehlay discuss kiya):
1. Router mein port forwarding karain (port 3000)
2. `npm start` chalayen, PC ko on rakhain
3. Kahin se bhi `http://[your-public-ip]:3000` se access karain

**Option B &mdash; Free cloud hosting (Render.com / Railway.app)**:
1. GitHub par project push karain
2. Render.com par "New Web Service" banayen, GitHub repo connect karain
3. Build command: `npm install`, Start command: `npm start`
4. Deploy hone ke baad public URL mil jaye ga

**Option C &mdash; ngrok se temporary public link**:
```
npm start
ngrok http 3000
```

## Folder Structure

```
hospital-management-system/
├── server.js              # Main server entry point
├── package.json
├── data/
│   └── db.json             # Cloud data store
├── routes/
│   ├── auth.js
│   ├── patients.js
│   ├── doctors.js
│   └── appointments.js
├── utils/
│   └── db.js                # Database read/write helper
└── public/
    ├── index.html            # Login page
    ├── dashboard.html         # Main dashboard
    ├── css/style.css
    └── js/
        ├── login.js
        └── dashboard.js
```

## Report Ke Liye Notes

- **Frontend-Backend communication**: REST API (fetch calls, JSON format)
- **CRUD operations**: Create, Read, Update, Delete &mdash; sab modules mein implemented hain
- **Security note for report**: Ye demo-level authentication hai (plain text password comparison). Production/real system ke liye bcrypt hashing aur JWT tokens use karne chahiye &mdash; report mein "future improvements" section mein likh sakte hain.
