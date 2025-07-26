// const API_BASE = location.hostname === 'localhost'
//   ? 'http://localhost:5500'
//   : 'https://your-backend-url.onrender.com'; // replace this with real backend URL
const API_BASE = 'http://localhost:4000';

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function loadGames() {
  const me = await fetch(`${API_BASE}/api/me`, { credentials: 'include' }).then(r => r.json());
  if (!me.user) {
    document.getElementById('available-games').style.display = 'none';
    return;
  } else {
    document.getElementById('available-games').style.display = 'block';
  }

  const res = await fetch(`${API_BASE}/api/games`, { credentials: 'include' });
  const games = await res.json();

  const container = document.getElementById('gamesList');
  container.innerHTML = '';

  games.forEach(game => {
    let distance = '';
    if (me.coords && game.coords) {
      const d = haversineDistance(me.coords.lat, me.coords.lon, game.coords.lat, game.coords.lon);
      distance = `<br><em>Distance: ${d.toFixed(1)} km</em>`;
    }
    const div = document.createElement('div');
    div.className = 'game-card';
    div.innerHTML = `
      <strong>${game.sport}</strong> at ${game.location}<br>
      Time: ${new Date(game.time).toLocaleString()}<br>
      Skill Level: ${game.skill}
      ${distance}
    `;
    container.appendChild(div);
  });
}

document.getElementById('gameForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const body = JSON.stringify(Object.fromEntries(formData.entries()));

  const res = await fetch(`${API_BASE}/api/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body
  });

  if (res.ok) {
    await loadGames();      // Refresh the game list
    e.target.reset();       // Clear the form
  } else {
    alert('Failed to post game. Make sure you are logged in and all fields are filled.');
  }
});

async function updateAuthButton() {
  const res = await fetch(`${API_BASE}/api/me`, { credentials: 'include' });
  const data = await res.json();

  const authBtn = document.getElementById('authButton');
  if (data.user) {
    authBtn.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;
  } else {
    authBtn.innerHTML = `<a href="login.html">Login</a>`;
  }
}

async function logout() {
  await fetch(`${API_BASE}/api/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  window.location.href = 'index.html'; // or reload
}

updateAuthButton();

loadGames();
