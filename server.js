const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const TASKS_FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GET
app.get('/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
  res.json(tasks);
});

// POST
app.post('/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
  tasks.push(req.body);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  res.status(201).json({ message: 'Tugas ditambahkan' });
});

// PATCH
app.patch('/tasks/:index', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
  const i = parseInt(req.params.index);
  tasks[i] = { ...tasks[i], ...req.body };
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  res.json({ message: 'Tugas diperbarui' });
});

// DELETE
app.delete('/tasks/:index', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
  tasks.splice(req.params.index, 1);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  res.json({ message: 'Tugas dihapus' });
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
