// Ambient Animations: Floating Hearts, Fluttering Butterflies & Touch Bursts 🦋💕
// Designed with 60FPS CSS + Canvas optimizations for Anchal

(function() {
  'use strict';

  // 1. Butterfly SVG Factory
  const BUTTERFLY_COLORS = [
    { wing1: '#F43F5E', wing2: '#FBBF24', body: '#881337' }, // Rose Pink & Amber Gold
    { wing1: '#FB7185', wing2: '#FDE047', body: '#9F1239' }, // Soft Rose & Sunlight
    { wing1: '#F59E0B', wing2: '#FDA4AF', body: '#78350F' }, // Warm Gold & Rose
    { wing1: '#E11D48', wing2: '#FEF08A', body: '#4C0519' }, // Crimson Rose & Lemon
    { wing1: '#EC4899', wing2: '#FDE68A', body: '#831843' }  // Pink & Soft Amber
  ];

  function createButterflySvg(colors, size = 32) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g class="wings-left">
          <!-- Top Left Wing -->
          <path d="M30 30 C 20 10, 5 12, 6 24 C 7 32, 22 34, 30 31 Z" fill="${colors.wing1}" opacity="0.92"/>
          <path d="M28 28 C 22 16, 12 18, 13 25 C 14 30, 24 31, 28 29 Z" fill="${colors.wing2}" opacity="0.8"/>
          <!-- Bottom Left Wing -->
          <path d="M30 32 C 18 36, 10 44, 16 50 C 22 54, 28 42, 30 33 Z" fill="${colors.wing2}" opacity="0.88"/>
        </g>
        <g class="wings-right">
          <!-- Top Right Wing -->
          <path d="M30 30 C 40 10, 55 12, 54 24 C 53 32, 38 34, 30 31 Z" fill="${colors.wing1}" opacity="0.92"/>
          <path d="M32 28 C 38 16, 48 18, 47 25 C 46 30, 36 31, 32 29 Z" fill="${colors.wing2}" opacity="0.8"/>
          <!-- Bottom Right Wing -->
          <path d="M30 32 C 42 36, 50 44, 44 50 C 38 54, 32 42, 30 33 Z" fill="${colors.wing2}" opacity="0.88"/>
        </g>
        <!-- Antennae & Body -->
        <path d="M28 18 Q 24 10 21 9 M32 18 Q 36 10 39 9" stroke="${colors.body}" stroke-width="1.8" stroke-linecap="round"/>
        <ellipse cx="30" cy="31" rx="2.5" ry="12" fill="${colors.body}"/>
      </svg>
    `;
  }

  // 2. Ambient Particles Container
  const container = document.createElement('div');
  container.id = 'ambient-particles';
  container.className = 'ambient-particles-layer';
  document.body.appendChild(container);

  // Floating Butterflies in Background
  const MAX_ACTIVE_BUTTERFLIES = 8;
  const butterflies = [];

  function spawnButterfly() {
    if (butterflies.length >= MAX_ACTIVE_BUTTERFLIES) return;

    const el = document.createElement('div');
    el.className = 'floating-butterfly';
    const colorScheme = BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)];
    const size = 26 + Math.random() * 16;
    el.innerHTML = createButterflySvg(colorScheme, size);

    // Initial random positions
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 40;
    const driftX = (Math.random() - 0.5) * 200;
    const duration = 12 + Math.random() * 8; // 12-20s duration

    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;
    el.style.setProperty('--drift-x', `${driftX}px`);
    el.style.animationDuration = `${duration}s`;

    container.appendChild(el);
    butterflies.push(el);

    setTimeout(() => {
      el.remove();
      const idx = butterflies.indexOf(el);
      if (idx > -1) butterflies.splice(idx, 1);
    }, duration * 1000);
  }

  // Floating Hearts in Background
  const HEART_CHARS = ['💕', '💖', '💗', '💓', '✨', '🌸', '🌹'];
  const MAX_ACTIVE_HEARTS = 12;
  const hearts = [];

  function spawnHeart() {
    if (hearts.length >= MAX_ACTIVE_HEARTS) return;

    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.innerText = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];

    const startX = Math.random() * window.innerWidth;
    const size = 16 + Math.random() * 18;
    const duration = 8 + Math.random() * 7;
    const driftX = (Math.random() - 0.5) * 120;

    el.style.left = `${startX}px`;
    el.style.fontSize = `${size}px`;
    el.style.setProperty('--drift-x', `${driftX}px`);
    el.style.animationDuration = `${duration}s`;

    container.appendChild(el);
    hearts.push(el);

    setTimeout(() => {
      el.remove();
      const idx = hearts.indexOf(el);
      if (idx > -1) hearts.splice(idx, 1);
    }, duration * 1000);
  }

  // Interval loops for ambient spawning
  setInterval(spawnButterfly, 2400);
  setInterval(spawnHeart, 1800);
  // Initial batch
  for (let i = 0; i < 4; i++) setTimeout(spawnButterfly, i * 400);
  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);

  // 3. Interactive Touch / Click Butterfly & Sparkle Burst 💥🦋
  function triggerBurst(x, y) {
    const burstCount = 8;
    for (let i = 0; i < burstCount; i++) {
      const p = document.createElement('div');
      p.className = 'touch-burst-particle';

      const isButterfly = i % 2 === 0;
      if (isButterfly) {
        const colorScheme = BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)];
        p.innerHTML = createButterflySvg(colorScheme, 22);
      } else {
        const icons = ['✨', '💕', '⭐', '🌸'];
        p.innerText = icons[Math.floor(Math.random() * icons.length)];
        p.style.fontSize = '18px';
      }

      // Calculate radial trajectory
      const angle = (i / burstCount) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
      const velocity = 60 + Math.random() * 80;
      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity - 40; // upward bias

      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty('--tx', `${targetX}px`);
      p.style.setProperty('--ty', `${targetY}px`);

      container.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, 1000);
    }
  }

  // Click & Touch listener
  window.addEventListener('pointerdown', (e) => {
    // Avoid triggering burst when tapping buttons directly to preserve cleanliness
    if (e.target.closest('button, input, a, .control-btn, .mini-player')) return;
    triggerBurst(e.clientX, e.clientY);
  }, { passive: true });

  window.triggerAnchalBurst = triggerBurst;
})();
