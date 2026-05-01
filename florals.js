// SVG florals — lilies & sunflowers, drawn programmatically, soft glow
// Inserted as inline SVG into containers tagged data-floral="lily|sunflower|bud"

window.Florals = {
  lily(opts = {}) {
    const { size = 320, hue = 'rose', glow = 0.6 } = opts;
    const stroke = hue === 'rose' ? '#ffd9e4' : '#fff';
    const fill = hue === 'rose' ? 'url(#lilyGradRose)' : 'url(#lilyGradWhite)';
    return `
<svg viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 40px rgba(255,143,182,${glow}));">
  <defs>
    <radialGradient id="lilyGradRose" cx="50%" cy="40%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#ffd9e4" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#ff5e94" stop-opacity="0.4"/>
    </radialGradient>
    <radialGradient id="lilyGradWhite" cx="50%" cy="40%">
      <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#fff0f4" stop-opacity="0.5"/>
    </radialGradient>
    <radialGradient id="lilyCenter" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#ffe9a8" stop-opacity="1"/>
      <stop offset="100%" stop-color="#e2a04f" stop-opacity="0.7"/>
    </radialGradient>
  </defs>
  <g transform="translate(200,200)">
    ${[0, 60, 120, 180, 240, 300].map(a => `
      <g transform="rotate(${a})">
        <path d="M 0 -10 Q -45 -80, -25 -160 Q 0 -190, 25 -160 Q 45 -80, 0 -10 Z"
              fill="${fill}" stroke="${stroke}" stroke-width="0.5" stroke-opacity="0.5"/>
        <path d="M 0 -20 Q -8 -100, 0 -170" stroke="${stroke}" stroke-width="0.6" fill="none" stroke-opacity="0.7"/>
      </g>
    `).join('')}
    <circle r="14" fill="url(#lilyCenter)"/>
    ${[0, 72, 144, 216, 288].map(a => `
      <g transform="rotate(${a})">
        <line x1="0" y1="0" x2="0" y2="-22" stroke="#c98a3e" stroke-width="1"/>
        <ellipse cx="0" cy="-26" rx="2" ry="4" fill="#e2a04f"/>
      </g>
    `).join('')}
  </g>
</svg>`;
  },

  sunflower(opts = {}) {
    const { size = 280, glow = 0.5 } = opts;
    return `
<svg viewBox="0 0 400 400" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 30px rgba(255,200,120,${glow}));">
  <defs>
    <radialGradient id="sfPetal" cx="50%" cy="20%">
      <stop offset="0%" stop-color="#fff3c8" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#f3c860" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#c97a3c" stop-opacity="0.7"/>
    </radialGradient>
    <radialGradient id="sfCenter" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#3a1a0a" stop-opacity="1"/>
      <stop offset="60%" stop-color="#5a2a10" stop-opacity="1"/>
      <stop offset="100%" stop-color="#2a1208" stop-opacity="1"/>
    </radialGradient>
    <pattern id="sfDots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1" fill="#1a0805"/>
    </pattern>
  </defs>
  <g transform="translate(200,200)">
    ${Array.from({length: 20}, (_, i) => i * 18).map(a => `
      <g transform="rotate(${a})">
        <path d="M 0 -55 Q -18 -90, -10 -150 Q 0 -170, 10 -150 Q 18 -90, 0 -55 Z"
              fill="url(#sfPetal)" stroke="#e0a040" stroke-width="0.4" stroke-opacity="0.4"/>
      </g>
    `).join('')}
    ${Array.from({length: 20}, (_, i) => i * 18 + 9).map(a => `
      <g transform="rotate(${a})">
        <path d="M 0 -50 Q -14 -78, -8 -130 Q 0 -148, 8 -130 Q 14 -78, 0 -50 Z"
              fill="url(#sfPetal)" opacity="0.85"/>
      </g>
    `).join('')}
    <circle r="55" fill="url(#sfCenter)"/>
    <circle r="55" fill="url(#sfDots)" opacity="0.6"/>
    <circle r="55" fill="none" stroke="#1a0805" stroke-width="2"/>
  </g>
</svg>`;
  },

  bud(opts = {}) {
    const { size = 80, glow = 0.4 } = opts;
    return `
<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 14px rgba(255,143,182,${glow}));">
  <defs>
    <radialGradient id="budG" cx="50%" cy="40%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#ff8eb3" stop-opacity="0.6"/>
    </radialGradient>
  </defs>
  <ellipse cx="50" cy="40" rx="14" ry="22" fill="url(#budG)" stroke="#ffd9e4" stroke-width="0.5" stroke-opacity="0.6"/>
  <path d="M 50 60 Q 48 80, 50 95" stroke="#9ab070" stroke-width="1.2" fill="none" opacity="0.7"/>
  <path d="M 50 75 Q 40 73, 35 65 Q 42 70, 50 75" fill="#7a9050" opacity="0.6"/>
</svg>`;
  },

  // Tiny floating petal
  petal(opts = {}) {
    const { size = 20 } = opts;
    return `
<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="pet${Math.random().toString(36).slice(2,6)}" cx="40%" cy="40%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ff8eb3" stop-opacity="0.5"/>
    </radialGradient>
  </defs>
  <ellipse cx="20" cy="20" rx="8" ry="14" fill="#ffb8cf" opacity="0.8" transform="rotate(20 20 20)"/>
</svg>`;
  },

  // Mount all data-floral elements
  mountAll() {
    document.querySelectorAll('[data-floral]').forEach(el => {
      const kind = el.dataset.floral;
      const size = parseInt(el.dataset.size || '300', 10);
      const hue = el.dataset.hue || 'rose';
      const glow = parseFloat(el.dataset.glow || '0.6');
      if (this[kind]) {
        el.innerHTML = this[kind]({ size, hue, glow });
      }
    });
  }
};
