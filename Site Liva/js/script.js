/* ============================================================
   LIVA SITE — script.js
   ============================================================ */

/* ── FLOATING PETALS ────────────────────────────────────── */
(function spawnPetals() {
  const emojis  = ['🌸', '🌷', '🌺', '✿', '❀'];
  const container = document.getElementById('petals');

  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const dur   = 8 + Math.random() * 12;          // 8–20 s
    const delay = -(Math.random() * dur);            // start mid-animation

    petal.style.left              = Math.random() * 100 + 'vw';
    petal.style.fontSize          = (14 + Math.random() * 16) + 'px';
    petal.style.opacity           = (0.3 + Math.random() * 0.4).toFixed(2);
    petal.style.animationDuration = dur + 's';
    petal.style.animationDelay   = delay + 's';

    container.appendChild(petal);
  }
})();


/* ── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);   // animate once only
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => observer.observe(el));
})();


/* ── CARD FLIP (envelope animation) ────────────────────── */
/**
 * Toggle flip on the inner .card element.
 * The onclick is on the .card-scene wrapper in the HTML.
 * @param {HTMLElement} scene  — the .card-scene that was clicked
 */
function flipCard(scene) {
  const card = scene.querySelector('.card');
  card.classList.toggle('flipped');
}


/* ── PHOTO UPLOAD ───────────────────────────────────────── */
/**
 * Read the selected image file and display it inside the photo area.
 * @param {HTMLInputElement} input   — the file input element
 * @param {string}           areaId — id of the target .photo-area div
 */
function loadPhoto(input, areaId) {
  const file = input.files[0];
  if (!file) return;

  const area   = document.getElementById(areaId);
  const reader = new FileReader();

  reader.onload = (e) => {
    // Hide placeholder text
    const placeholder = area.querySelector('.photo-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    // Reuse existing <img> or create a new one
    let img = area.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      area.prepend(img);
    }

    img.src = e.target.result;
    img.alt = 'Memory photo';
  };

  reader.readAsDataURL(file);
}


/* ── SPOTIFY iPHONE PLAYER (animated) ──────────────────── */
const TOTAL_SECONDS = 184;   // 3:04 — Wanna Be Yours
let   elapsed       = 9;     // start at 0:09
let   isPlaying     = true;
let   playerTimer   = null;

function formatTime(s) {
  const abs = Math.abs(s);
  const m   = Math.floor(abs / 60);
  const sec = String(abs % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

function updatePlayer() {
  const pct = (elapsed / TOTAL_SECONDS) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-dot').style.left   = pct + '%';
  document.getElementById('time-current').textContent  = formatTime(elapsed);

  const remaining = elapsed - TOTAL_SECONDS;          // negative value
  document.getElementById('time-total').textContent    = '-' + formatTime(remaining);
}

function tick() {
  if (!isPlaying) return;
  if (elapsed < TOTAL_SECONDS) {
    elapsed++;
    updatePlayer();
  } else {
    // loop
    elapsed = 0;
    updatePlayer();
  }
}

function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById('play-btn').textContent = isPlaying ? '⏸' : '▶';
}

function seekBack() {
  elapsed = Math.max(0, elapsed - 10);
  updatePlayer();
}

function seekFwd() {
  elapsed = Math.min(TOTAL_SECONDS, elapsed + 10);
  updatePlayer();
}

// Start ticker
updatePlayer();
playerTimer = setInterval(tick, 1000);
