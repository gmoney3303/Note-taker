const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const notesPath = path.join(__dirname, 'Db', 'db.json');

// Middleware to parse JSON and serve static assets
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  try {
    const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
  newNote.id = generateUniqueId(notes);
  notes.push(newNote);
  fs.writeFileSync('db/db.json', JSON.stringify(notes), 'utf8');
  res.json(newNote);
});



app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
  const noteId = parseInt(req.params.id);
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync('db/db.json', JSON.stringify(updatedNotes), 'utf8');
  res.sendStatus(200);
});

// Helper function to generate unique IDs
function generateUniqueId(notes) {
  const ids = notes.map((note) => note.id);
  let newId = 1;
  while (ids.includes(newId)) {
    newId++;
  }
  return newId;
}



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});