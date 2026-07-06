const express = require('express');
const cors = require('cors');
const path = require('path');
const { readDB } = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));

app.get('/api/stats', (req, res) => {
  const db = readDB();
  const today = new Date().toISOString().split('T')[0];
  res.json({
    totalPatients: db.patients.length,
    admittedPatients: db.patients.filter(p => p.status === 'Admitted').length,
    totalDoctors: db.doctors.length,
    totalAppointments: db.appointments.length,
    todayAppointments: db.appointments.filter(a => a.date === today).length,
    pendingAppointments: db.appointments.filter(a => a.status === 'Pending').length
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ================================================');
  console.log('   Hospital Management System is running!');
  console.log('   Open your browser: http://localhost:' + PORT);
  console.log('  ================================================');
  console.log('');
});
