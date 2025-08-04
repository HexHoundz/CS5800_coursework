const express = require('express');
const cors = require('cors');
const session = require('express-session');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 4000;

let users = []; // { username, password, location, coords }
let games = []; // { sport, location, time, skill, coords, postedBy }

// app.use(cors({
//   origin: 'null', // needed when serving frontend as a file:// URL
//   credentials: true
// }));

app.use(cors({
  origin: 'https://psm-viewer.onrender.com', // change from 'null'
  credentials: true
}));


app.use(express.json());
app.use(session({
  secret: 'psm_secret',
  resave: false,
  saveUninitialized: true
}));

app.set('trust proxy', 1);

function geocodeLocation(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'PSM-App/1.0 (sriman@example.com)' // <- REPLACE with a real email if publishing
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.length > 0) {
            resolve({
              lat: parseFloat(parsed[0].lat),
              lon: parseFloat(parsed[0].lon)
            });
          } else {
            resolve(null);
          }
        } catch (err) {
          console.error('Invalid JSON response:', data);
          reject(err);
        }
      });
    }).on('error', reject);
  });
}
app.post('/api/register', async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  const { username, password, location } = req.body;
  if (!username || !password || !location) return res.status(400).json({ error: 'Missing fields' });

  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'User exists' });
  const coords = await geocodeLocation(location);
  users.push({ username, password, location, coords });
  req.session.user = username;
  res.status(201).json({ message: 'Registered' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    req.session.user = username;
    return res.json({ message: 'Logged in' });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // Optional, clears session cookie
    res.json({ message: 'Logged out' });
  });
});

app.get('/api/me', (req, res) => {
  const user = users.find(u => u.username === req.session.user);
  if (!user) return res.json({ user: null });
  res.json({ user: user.username, location: user.location, coords: user.coords });
});

app.get('/api/games', (req, res) => {
  res.json(games);
});

app.post('/api/games', async (req, res) => {
  const { sport, location, time, skill } = req.body;
  const user = users.find(u => u.username === req.session.user);
  if (!user) return res.status(401).json({ error: 'Login required' });
  if (!sport || !location || !time || !skill) return res.status(400).json({ error: 'Missing fields' });

  const coords = await geocodeLocation(location);
  games.push({ sport, location, time, skill, coords, postedBy: user.username });
  res.status(201).json({ message: 'Game posted' });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));