// ============ Vanilla Tweaks Panel ============
(function () {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "primaryHue": 335,
    "particleDensity": 1,
    "blurStrength": 24,
    "florals": true,
    "auroraIntensity": 0.7,
    "showRail": true
  }/*EDITMODE-END*/;

  let state = { ...TWEAK_DEFAULTS };
  let panel = null;
  let active = false;

  function applyTweaks() {
    const root = document.documentElement;
    // Hue rotation on roses
    const h = state.primaryHue;
    root.style.setProperty('--rose-300', `hsl(${h}, 100%, 78%)`);
    root.style.setProperty('--rose-400', `hsl(${h}, 100%, 68%)`);
    root.style.setProperty('--rose-500', `hsl(${h}, 100%, 62%)`);
    root.style.setProperty('--glow', `hsl(${h}, 100%, 70%)`);

    // Blur
    document.querySelectorAll('.glass, .glass-pink').forEach(el => {
      el.style.backdropFilter = `blur(${state.blurStrength}px) saturate(150%)`;
      el.style.webkitBackdropFilter = `blur(${state.blurStrength}px) saturate(150%)`;
    });

    // Florals visibility
    document.querySelectorAll('.floral, [data-floral]').forEach(el => {
      el.style.display = state.florals ? '' : 'none';
    });

    // Aurora opacity
    document.querySelectorAll('.aurora').forEach(el => {
      el.style.opacity = state.auroraIntensity;
    });

    // Rail
    const rail = document.getElementById('rail');
    if (rail) rail.style.display = state.showRail ? '' : 'none';

    // Particle density via canvas opacity (cheap proxy)
    document.querySelectorAll('.particles').forEach(el => {
      el.style.opacity = state.particleDensity;
    });
  }

  function persist(edits) {
    state = { ...state, ...edits };
    applyTweaks();
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch (e) {}
  }

  function build() {
    panel = document.createElement('div');
    panel.id = 'tweaksPanel';
    panel.innerHTML = `
      <style>
        #tweaksPanel {
          position: fixed; right: 24px; bottom: 24px;
          width: 320px; z-index: 9999;
          background: rgba(15,5,10,0.85);
          backdrop-filter: blur(28px) saturate(140%);
          -webkit-backdrop-filter: blur(28px) saturate(140%);
          border: 1px solid rgba(255,182,210,0.25);
          border-radius: 20px;
          padding: 22px 22px 20px;
          font-family: var(--sans, sans-serif);
          color: #fbf6f1;
          box-shadow: 0 30px 80px rgba(255,62,127,0.25), 0 0 0 1px rgba(255,255,255,0.04) inset;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.4s, transform 0.4s;
          pointer-events: none;
        }
        #tweaksPanel.show { opacity: 1; transform: none; pointer-events: all; }
        #tweaksPanel .tk-head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        #tweaksPanel .tk-title {
          font-family: 'Italiana', serif;
          font-size: 18px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        #tweaksPanel .tk-close {
          background: none; border: 1px solid rgba(255,255,255,0.2);
          color: #fbf6f1;
          width: 24px; height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px; line-height: 1;
        }
        #tweaksPanel .tk-row {
          margin-bottom: 14px;
        }
        #tweaksPanel .tk-label {
          display: flex; justify-content: space-between;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 8px;
          color: rgba(251,246,241,0.7);
        }
        #tweaksPanel .tk-label .tk-val { color: #ffb8cf; font-family: 'JetBrains Mono', monospace; letter-spacing: 0; }
        #tweaksPanel input[type=range] {
          width: 100%; -webkit-appearance: none; appearance: none;
          background: linear-gradient(to right, #ff5e94, rgba(255,255,255,0.1));
          height: 2px; border-radius: 2px; outline: none;
        }
        #tweaksPanel input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          background: #fff; border: 1px solid #ff5e94;
          border-radius: 50%; cursor: pointer;
          box-shadow: 0 0 12px rgba(255,94,148,0.6);
        }
        #tweaksPanel .tk-toggle {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0;
          cursor: pointer;
        }
        #tweaksPanel .tk-tog-track {
          width: 36px; height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 999px;
          position: relative;
          transition: background 0.3s;
        }
        #tweaksPanel .tk-tog-track.on {
          background: #ff5e94;
        }
        #tweaksPanel .tk-tog-thumb {
          position: absolute; top: 2px; left: 2px;
          width: 16px; height: 16px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.3s;
        }
        #tweaksPanel .tk-tog-track.on .tk-tog-thumb { transform: translateX(16px); }
        #tweaksPanel .tk-foot {
          margin-top: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          text-align: center;
        }
      </style>

      <div class="tk-head">
        <span class="tk-title">Tweaks</span>
        <button class="tk-close" id="tkClose">×</button>
      </div>

      <div class="tk-row">
        <div class="tk-label"><span>Primary Hue</span><span class="tk-val" id="tkHueV">${state.primaryHue}°</span></div>
        <input type="range" id="tkHue" min="280" max="360" step="1" value="${state.primaryHue}">
      </div>

      <div class="tk-row">
        <div class="tk-label"><span>Particle Density</span><span class="tk-val" id="tkDenV">${state.particleDensity.toFixed(1)}</span></div>
        <input type="range" id="tkDen" min="0" max="1.4" step="0.1" value="${state.particleDensity}">
      </div>

      <div class="tk-row">
        <div class="tk-label"><span>Glass Blur</span><span class="tk-val" id="tkBlurV">${state.blurStrength}px</span></div>
        <input type="range" id="tkBlur" min="6" max="48" step="2" value="${state.blurStrength}">
      </div>

      <div class="tk-row">
        <div class="tk-label"><span>Aurora Glow</span><span class="tk-val" id="tkAurV">${state.auroraIntensity.toFixed(1)}</span></div>
        <input type="range" id="tkAur" min="0" max="1.2" step="0.1" value="${state.auroraIntensity}">
      </div>

      <div class="tk-row tk-toggle" id="tkFlorals">
        <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(251,246,241,0.7);">Florals</span>
        <span class="tk-tog-track ${state.florals ? 'on' : ''}"><span class="tk-tog-thumb"></span></span>
      </div>

      <div class="tk-row tk-toggle" id="tkRail" style="margin-bottom:0;">
        <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(251,246,241,0.7);">Scene Rail</span>
        <span class="tk-tog-track ${state.showRail ? 'on' : ''}"><span class="tk-tog-thumb"></span></span>
      </div>

      <div class="tk-foot">edit · live · romantic</div>
    `;
    document.body.appendChild(panel);

    // Bind
    panel.querySelector('#tkClose').addEventListener('click', deactivate);

    panel.querySelector('#tkHue').addEventListener('input', e => {
      const v = +e.target.value;
      panel.querySelector('#tkHueV').textContent = v + '°';
      persist({ primaryHue: v });
    });
    panel.querySelector('#tkDen').addEventListener('input', e => {
      const v = +e.target.value;
      panel.querySelector('#tkDenV').textContent = v.toFixed(1);
      persist({ particleDensity: v });
    });
    panel.querySelector('#tkBlur').addEventListener('input', e => {
      const v = +e.target.value;
      panel.querySelector('#tkBlurV').textContent = v + 'px';
      persist({ blurStrength: v });
    });
    panel.querySelector('#tkAur').addEventListener('input', e => {
      const v = +e.target.value;
      panel.querySelector('#tkAurV').textContent = v.toFixed(1);
      persist({ auroraIntensity: v });
    });
    panel.querySelector('#tkFlorals').addEventListener('click', () => {
      const next = !state.florals;
      panel.querySelector('#tkFlorals .tk-tog-track').classList.toggle('on', next);
      persist({ florals: next });
    });
    panel.querySelector('#tkRail').addEventListener('click', () => {
      const next = !state.showRail;
      panel.querySelector('#tkRail .tk-tog-track').classList.toggle('on', next);
      persist({ showRail: next });
    });
  }

  function activate() {
    if (!panel) build();
    active = true;
    panel.classList.add('show');
  }
  function deactivate() {
    if (!panel) return;
    active = false;
    panel.classList.remove('show');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
  }

  // Listen first, then announce
  window.addEventListener('message', (e) => {
    if (!e.data) return;
    if (e.data.type === '__activate_edit_mode') activate();
    if (e.data.type === '__deactivate_edit_mode') deactivate();
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

  // Apply defaults on load
  applyTweaks();
})();
