const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.patients);
});

router.post('/', (req, res) => {
  const db = readDB();
  const newPatient = { id: db.nextIds.patients, ...req.body };
  db.patients.push(newPatient);
  db.nextIds.patients += 1;
  writeDB(db);
  res.status(201).json(newPatient);
});

router.put('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.patients.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Patient not found' });

  db.patients[index] = { ...db.patients[index], ...req.body, id };
  writeDB(db);
  res.json(db.patients[index]);
});

router.delete('/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.patients = db.patients.filter(p => p.id !== id);
  writeDB(db);
  res.json({ success: true });
});

module.exports = router;
