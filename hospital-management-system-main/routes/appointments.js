const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.appointments);
});

router.post('/', (req, res) => {
  const db = readDB();
  const newAppt = { id: db.nextIds.appointments, ...req.body };
  db.appointments.push(newAppt);
  db.nextIds.appointments += 1;
  writeDB(db);
  res.status(201).json(newAppt);
});

router.put('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.appointments.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });

  db.appointments[index] = { ...db.appointments[index], ...req.body, id };
  writeDB(db);
  res.json(db.appointments[index]);
});

router.delete('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.appointments = db.appointments.filter(a => a.id !== id);
  writeDB(db);
  res.json({ success: true });
});

module.exports = router;
