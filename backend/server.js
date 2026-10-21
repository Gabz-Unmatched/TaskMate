
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database(
  process.env.DB_PATH || path.join(__dirname, 'taskmate.db')
);

app.use(cors());
app.use(express.json());

db.exec(`
  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    deadline TEXT,
    priority TEXT DEFAULT 'Medium',
    completed INTEGER DEFAULT 0
  )
`);

app.get('/api/assignments', (req, res) => {
  res.json(db.prepare('SELECT * FROM assignments ORDER BY id DESC').all());
});

app.post('/api/assignments', (req, res) => {
  const { title, subject, deadline, priority } = req.body;

  if (!title?.trim() || !subject?.trim()) {
    return res.status(400).json({ error: 'Title and subject are required' });
  }

  const result = db.prepare(`
    INSERT INTO assignments (title, subject, deadline, priority)
    VALUES (?, ?, ?, ?)
  `).run(title.trim(), subject.trim(), deadline || null, priority || 'Medium');

  res.status(201).json(
    db.prepare('SELECT * FROM assignments WHERE id = ?').get(result.lastInsertRowid)
  );
});


app.put('/api/assignments/:id', (req, res) => {
  const { title, subject, deadline, priority } = req.body;

  if (!title?.trim() || !subject?.trim() || !deadline) {
    return res.status(400).json({
      error: 'Title, subject, and deadline are required'
    });
  }

  const result = db.prepare(`
    UPDATE assignments
    SET title = ?, subject = ?, deadline = ?, priority = ?
    WHERE id = ?
  `).run(
    title.trim(),
    subject.trim(),
    deadline,
    priority || 'Medium',
    req.params.id
  );

  if (!result.changes) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  res.json(
    db.prepare('SELECT * FROM assignments WHERE id = ?').get(req.params.id)
  );
});


app.delete('/api/assignments/:id', (req, res) => {
  const result = db.prepare(
    'DELETE FROM assignments WHERE id = ?'
  ).run(req.params.id);

  if (!result.changes) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  res.json({ success: true });
});

if (require.main === module) {
  app.listen(5000, () => {
    console.log('TaskMate API running at http://localhost:5000');
  });
}

app.closeDatabase = () => db.close();

module.exports = app;
