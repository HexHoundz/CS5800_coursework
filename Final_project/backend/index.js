const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

let games = [];

app.use(cors());
app.use(express.json());

app.get('/api/games', (req, res) => {
  res.json(games);
});

app.post('/api/games', (req, res) => {
  const { sport, location, time, skill } = req.body;
  if (!sport || !location || !time || !skill) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  games.push({ sport, location, time, skill });
  res.status(201).json({ message: 'Game posted' });
});

app.listen(PORT, () => console.log(`Backend server is running at http://localhost:${PORT}`));
