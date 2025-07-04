// const section = document.querySelector('section.vid');
// const vid = section.querySelector('video');

// vid.pause();

// const scroll = () => {
//     const distance = window.scrollY - section.offsetTop;
//     const total = section.clientHeight - window.innerHeight;
//     let percentage = distance / total;
//     percentage = Math.max(percentage, 0);
//     percentage = Math.min(percentage, 1); // Ensure percentage does not exceed 1
//     if (vid.duration > 0)
//     {
//         vid.currentTime = vid.duration * percentage * 0.1;
//     }
// };

// scroll();
// window.addEventListener('scroll', scroll);
document.getElementById('gameForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const gameData = Object.fromEntries(formData.entries());

  const res = await fetch('https://hexhoundz-backend.onrender.com/api/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData)
  });

  if (res.ok) {
    e.target.reset();
    loadGames();
  }
});

async function loadGames() {
  const res = await fetch('https://hexhoundz-backend.onrender.com/api/games');
  const games = await res.json();

  const container = document.getElementById('gamesList');
  container.innerHTML = '';

  games.forEach(game => {
    const div = document.createElement('div');
    div.className = 'game-card';
    div.innerHTML = `
      <strong>${game.sport}</strong> at ${game.location}<br>
      Time: ${new Date(game.time).toLocaleString()}<br>
      Skill Level: ${game.skill}
    `;
    container.appendChild(div);
  });
}

// Scroll-triggered video playback
window.addEventListener('scroll', () => {
  const video = document.getElementById('scrollVideo');
  const rect = video.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    video.play();
  } else {
    video.pause();
  }
});

loadGames();
