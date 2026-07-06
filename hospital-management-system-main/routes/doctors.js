const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.doctors);
});

router.post('/', (req, res) => {
  const db = readDB();
  const newDoctor = { id: db.nextIds.doctors, ...req.body };
  db.doctors.push(newDoctor);
  db.nextIds.doctors += 1;
  writeDB(db);
  res.status(201).json(newDoctor);
});

router.put('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.doctors.findIndex(d => d.id === id);
  if (index === -1) return res.status(404).json({ message: 'Doctor not found' });

  db.doctors[index] = { ...db.doctors[index], ...req.body, id };
  writeDB(db);
  res.json(db.doctors[index]);
});

router.delete('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.doctors = db.doctors.filter(d => d.id !== id);
  writeDB(db);
  res.json({ success: true });
});

module.exports = router;
